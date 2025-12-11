'use client'
import Link from "next/link";
import {FormInfo} from "@/components/forms/form-info";
import UploadAvatar from "@/components/dashboard/profile/upload-avatar";
import ProfileSetting from "@/components/dashboard/profile/profile-setting";
import Security from "@/components/dashboard/profile/security";
import {useCurrentUser} from "@/hooks/use-current-user";
import {useState} from "react";
import {cn} from "@/lib/utils";

export default function Settings(){
	const user = useCurrentUser();
	const [isObserved, observe] = useState('avatar')

	return (
		<div className="container">
			<div className="flex flex-col md:flex-row">
				<nav className="md:sticky md:max-h-[calc(100vh_-_4rem)] md:h-full md:top-20 overflow-y-auto -ml-3.5">
					<ul className="list-none px-0 py-5 pr-8 m-0 min-w-52">
						<li className="mb-2">
							<Link
								className={cn('text-sm text-gray-400 leading-6 px-3.5 md:py-2 py-1.5 hover:bg-slate-25 rounded-sm block bg-slate-25', {
									"text-gray-900": isObserved === 'avatar'
								})}
								onClick={()=>observe('avatar')}
								href={'/dashboard/settings#avatar'}
							>
								Ảnh đại diện
							</Link>
						</li>
						<li className="mb-2">
							<Link
								className={cn('text-sm text-gray-400 leading-6 px-3.5 md:py-2 py-1.5 hover:bg-slate-25 rounded-sm block bg-slate-25', {
									"text-gray-900": isObserved === 'profile'
								})}
								onClick={()=>observe('profile')}
								href={'/dashboard/settings#profile'}
							>
								Hồ Sơ
							</Link>
						</li>
						<li className="mb-2">
							<Link
								className={cn('text-sm text-gray-400 leading-6 px-3.5 md:py-2 py-1.5 hover:bg-slate-25 rounded-sm block bg-slate-25', {
									"text-gray-900": isObserved === 'security'
								})}
								onClick={()=>observe('security')}
								href={'/dashboard/settings#security'}
							>
								Bảo Mật
							</Link>
						</li>
					</ul>
				</nav>

				<div className={'flex flex-col flex-1 py-4'}>
					{!Boolean(user?.isPasswordSet) && (
						<FormInfo
							className={'mb-5'}
							message={(
								<>
									Tài khoản mới, hãy đặt <Link className={'text-indigo-700 underline'} href={'/dashboard/settings#security'}>mật khẩu</Link> cho email này
								</>
							)}
						/>
					)}

					<UploadAvatar observe={()=>observe('avatar')}/>
					<ProfileSetting observe={()=>observe('profile')}/>
					<Security observe={()=>observe('security')}/>
				</div>
			</div>
		</div>
	)
}
