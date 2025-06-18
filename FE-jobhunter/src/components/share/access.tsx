import { useEffect, useState } from 'react';
import { Result } from "antd";
import { useAppSelector } from '@/redux/hooks';
interface IProps {
    hideChildren?: boolean;
    children: React.ReactNode;
    permission: { method: string, apiPath: string, module: string };
}

const Access = (props: IProps) => {
    //set default: hideChildren = false => vẫn render children
    // hideChildren = true => ko render children, ví dụ hide button (button này check quyền)
    const { permission, hideChildren = false } = props;
    const [allow, setAllow] = useState<boolean>(true);

    const permissions = useAppSelector(state => state.account.user.role.permissions);
    const user = useAppSelector(state => state.account.user);
    const isSuperAdmin = user?.role?.name === 'SUPER_ADMIN';

    useEffect(() => {
        // Debug log
        console.log('Access component - User role:', user?.role?.name);
        console.log('Access component - Is SuperAdmin:', isSuperAdmin);
        console.log('Access component - Permissions:', permissions);
        console.log('Access component - Required permission:', permission);
        
        // SUPER_ADMIN có quyền truy cập tất cả
        if (isSuperAdmin) {
            console.log('Access component - SuperAdmin access granted');
            setAllow(true);
            return;
        }

        if (permissions?.length) {
            const check = permissions.find((item: any) =>
                item.apiPath === permission.apiPath
                && item.method === permission.method
                && item.module === permission.module
            )
            if (check) {
                console.log('Access component - Permission check passed');
                setAllow(true)
            } else {
                console.log('Access component - Permission check failed');
                setAllow(false);
            }
        }
    }, [permissions, isSuperAdmin])

    return (
        <>
            {allow === true || import.meta.env.VITE_ACL_ENABLE === 'false' ?
                <>{props.children}</>
                :
                <>
                    {hideChildren === false ?
                        <Result
                            status="403"
                            title="Truy cập bị từ chối"
                            subTitle="Xin lỗi, bạn không có quyền hạn (permission) truy cập thông tin này"
                        />
                        :
                        <>
                            {/* render nothing */}
                        </>
                    }
                </>
            }
        </>

    )
}

export default Access;