from fastapi import FastAPI
import pandas as pd
from sqlalchemy import create_engine
from sklearn.preprocessing import MinMaxScaler
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
import numpy as np
import pickle
from sqlalchemy import text
from sklearn.metrics import silhouette_score

# uvicorn recomendation_system:app --reload
# Cấu hình kết nối với cơ sở dữ liệu MySQL
db_config = {
    'user': 'root',
    'password': '123456',
    'host': 'localhost',
    'database': 'jobhunter'
}

engine = create_engine(
    f"mysql+pymysql://{db_config['user']}:{db_config['password']}@{db_config['host']}/{db_config['database']}")

app = FastAPI()

# Định nghĩa hàm tokenization
def tokenize_skills(text):
    return text.split(',')

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

# 1. Hàm tìm số lượng cụm tối ưu
def find_K(dataset):
    distortions = []
    K = range(1, 10)  # Thử nghiệm số lượng cụm từ 1 đến 9
    for k in K:
        kmeanModel = KMeans(n_clusters=k, random_state=42)
        kmeanModel.fit(dataset)
        distortions.append(kmeanModel.inertia_)
    # Tìm giá trị K khi tỉ lệ giảm không đáng kể (90%-93%)
    for i in range(1, len(distortions)):
        if distortions[i] / distortions[i - 1] > 0.93:
            return i
    return len(K)

# 2. Hàm tiền xử lý dữ liệu
def preprocess_jobs_data(jobs_df, tfidf_vectorizer=None, scaler=None):
    # Xử lý giá trị null
    jobs_df['Salary'] = jobs_df['Salary'].fillna(0)
    jobs_df['Level'] = jobs_df['Level'].fillna('UNKNOWN')
    jobs_df['Location'] = jobs_df['Location'].fillna('UNKNOWN')
    jobs_df['Skills'] = jobs_df['Skills'].fillna('')

    # Mã hóa cột
    level_mapping = {'INTERN': 0, 'JUNIOR': 1, 'MIDDLE': 2, 'SENIOR': 3, 'FRESHER': 4}
    jobs_df['Level_encoded'] = jobs_df['Level'].map(level_mapping)

    location_mapping = {loc: idx for idx, loc in enumerate(jobs_df['Location'].unique())}
    jobs_df['Location_encoded'] = jobs_df['Location'].map(location_mapping)

    # Nếu chưa có vectorizer, tạo mới TfidfVectorizer
    if tfidf_vectorizer is None:
        tfidf_vectorizer = TfidfVectorizer(tokenizer=tokenize_skills)  # Sử dụng hàm tokenize_skills
        skills_tfidf = tfidf_vectorizer.fit_transform(jobs_df['Skills'])
    else:
        skills_tfidf = tfidf_vectorizer.transform(jobs_df['Skills'])

    # Convert TF-IDF matrix to DataFrame
    skills_tfidf_df = pd.DataFrame(skills_tfidf.toarray(), columns=tfidf_vectorizer.get_feature_names_out())
    jobs_df = pd.concat([jobs_df, skills_tfidf_df], axis=1)

    if scaler is None:
        scaler = MinMaxScaler()
        jobs_df['Salary_scaled'] = scaler.fit_transform(jobs_df[['Salary']])
    else:
        jobs_df['Salary_scaled'] = scaler.transform(jobs_df[['Salary']])

    return jobs_df, tfidf_vectorizer, scaler

# 3. API phân cụm công việc
@app.get("/cluster")
def cluster():
    # Truy vấn dữ liệu công việc
    query = """
            SELECT 
                jobs.Id,
                jobs.Salary,
                jobs.Level,
                jobs.Location,
                GROUP_CONCAT(skills.Name) AS Skills
            FROM JOBS jobs
            LEFT JOIN JOB_SKILL job_skill ON jobs.Id = job_skill.Job_id
            LEFT JOIN SKILLS skills ON job_skill.Skill_id = skills.Id
            GROUP BY jobs.Id;
        """
    try:
        jobs_df = pd.read_sql(query, engine)
    except Exception as e:
        print(f"Lỗi khi truy vấn dữ liệu công việc: {e}")
        return {"message": "Không thể truy vấn dữ liệu công việc."}

    # Tiền xử lý dữ liệu
    processed_jobs_df, tfidf_vectorizer, scaler = preprocess_jobs_data(jobs_df)

    # Huấn luyện mô hình K-Means
    feature_columns = ['Salary_scaled', 'Level_encoded', 'Location_encoded'] + list(tfidf_vectorizer.get_feature_names_out())
    dataset = processed_jobs_df[feature_columns]
    optimal_k = find_K(dataset)
    print(optimal_k)
    kmeans = KMeans(n_clusters=optimal_k, random_state=42)
    processed_jobs_df['Cluster'] = kmeans.fit_predict(dataset)

    # Đánh giá chất lượng phân cụm bằng Silhouette Score
    silhouette_avg = silhouette_score(dataset, processed_jobs_df['Cluster'])
    print(f"Silhouette Score cho {optimal_k} cụm là: {silhouette_avg}")

    # Lưu mô hình và các công cụ tiền xử lý
    with open('kmeans_model.pkl', 'wb') as file:
        pickle.dump({'model': kmeans, 'tfidf_vectorizer': tfidf_vectorizer, 'scaler': scaler}, file)

    # Cập nhật cột Cluster trong bảng JOBS
    try:
        update_query = text("""UPDATE JOBS SET cluster = :cluster WHERE id = :job_id""")
        update_data = [{'cluster': int(cluster), 'job_id': int(job_id)} for cluster, job_id in
                       zip(processed_jobs_df['Cluster'], processed_jobs_df['Id'])]

        with engine.connect() as connection:
            result = connection.execute(update_query, update_data)
            connection.commit()
        print(f"{result.rowcount} bản ghi đã được cập nhật.")
        return {"message": f"Phân cụm công việc đã hoàn thành với Silhouette Score: {silhouette_avg}."}
    except Exception as e:
        print(f"Lỗi khi cập nhật cột Cluster: {e}")
        return {"message": "Có lỗi khi cập nhật cụm công việc."}

# 4. API dự đoán cụm của người dùng
@app.get("/predict-user-cluster/{user_id}")
def predict_user_cluster(user_id: int):
    # 1. Truy vấn công việc mà người dùng đã nộp
    applied_jobs_df = get_user_applied_jobs(user_id)
    if applied_jobs_df is None or applied_jobs_df.empty:
        applied_jobs_df = get_user_desired_jobs(user_id)

    # 2. Tải mô hình KMeans và các công cụ tiền xử lý
    try:
        with open('kmeans_model.pkl', 'rb') as file:
            data = pickle.load(file)
            kmeans_model = data['model']
            tfidf_vectorizer = data['tfidf_vectorizer']
            scaler = data['scaler']
    except Exception as e:
        print(f"Lỗi khi tải mô hình KMeans: {e}")
        return {"message": "Không thể tải mô hình KMeans."}

    # 3. Tiền xử lý dữ liệu của các công việc đã nộp hoặc mong muốn
    processed_jobs_df, _, _ = preprocess_jobs_data(applied_jobs_df, tfidf_vectorizer=tfidf_vectorizer, scaler=scaler)

    # 4. Tính vector trung bình từ các công việc của người dùng
    feature_columns = ['Salary_scaled', 'Level_encoded', 'Location_encoded'] + list(tfidf_vectorizer.get_feature_names_out())
    user_vector = pd.DataFrame([processed_jobs_df[feature_columns].mean(axis=0)], columns=feature_columns)

    # 5. Dự đoán cụm của người dùng
    user_cluster = kmeans_model.predict(user_vector)
    return {"user_id": user_id, "cluster": int(user_cluster[0])}

# Các hàm phụ trợ để lấy công việc của người dùng
def get_user_applied_jobs(user_id):
    query = f"""
        SELECT 
            jobs.Salary,
            jobs.Level,
            jobs.Location,
            GROUP_CONCAT(skills.Name) AS Skills
        FROM JOBS jobs
        LEFT JOIN JOB_SKILL job_skill ON jobs.Id = job_skill.Job_id
        LEFT JOIN SKILLS skills ON job_skill.Skill_id = skills.Id
        LEFT JOIN RESUMES resumes ON jobs.Id = resumes.Job_id
        WHERE resumes.User_id = {user_id}
        GROUP BY jobs.Id;
    """
    try:
        return pd.read_sql(query, engine)
    except Exception as e:
        print(f"Lỗi khi truy vấn công việc người dùng đã nộp: {e}")
        return None

def get_user_desired_jobs(user_id):
    query = f"""
        SELECT 
            users.Salary,
             users.Level,   
            users.Address,
            GROUP_CONCAT(skills.Name) AS Skills
        FROM USERS users
        LEFT JOIN USER_SKILL user_skill ON users.Id = user_skill.User_id
        LEFT JOIN SKILLS skills ON user_skill.Skill_id = skills.Id
        WHERE users.Id = {user_id}
        GROUP BY users.Id;
    """
    try:
        user_details_df = pd.read_sql(query, engine)

        # Đổi tên cột 'Address' thành 'Location'
        user_details_df = user_details_df.rename(columns={"Address": "Location"})

        return user_details_df
    except Exception as e:
        print(f"Lỗi khi truy vấn thông tin người dùng: {e}")
        return None
# print(predict_user_cluster(4))