import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { useToggleState } from '@/hooks'
import supabase from '@/libs/supabase'
import { navigate, tw } from '@/utils'

type SigninFormData = {
  email: string
  password: string
}

export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SigninFormData>({
    mode: 'onChange',
  })

  const [showPassword, { toggle }] = useToggleState(false)

  const onSubmit = async (formData: SigninFormData) => {
    if (isSubmitting) return

    const { error, data } = await supabase.auth.signInWithPassword(formData)

    if (error) {
      toast.error(
        `로그인 오류 발생! ${error.status}:${error.name}:${error.message}`
      )
    } else {
      if (data.user) {
        const { username } = data.user.user_metadata

        toast.success(`${username}님! 로그인이 성공되었습니다.`, {
          action: {
            label: '프로필 페이지로 이동',
            onClick: () => {
              navigate('profile')

              reset()
            },
          },
        })
      }
    }
  }

  return (
    <div className="max-w-md w-80 mx-auto bg-white rounded-lg p-4">
      <h2 className="text-xl font-bold mb-6 text-center">로그인</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        aria-label="로그인 폼"
        autoComplete="off"
        noValidate
      >
        <div className="mb-4">
          <label htmlFor="login-email" className="block font-medium mb-1">
            이메일
          </label>
          <input
            type="text"
            id="login-email"
            autoComplete="off"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
            {...register('email', {
              required: '이름 또는 이메일을 입력하세요',
            })}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
              errors.email
                ? 'border-red-500 ring-red-300'
                : 'border-gray-300 focus:ring-blue-300'
            }`}
          />
          {errors.email && (
            <div
              id="login-email-error"
              className="text-red-500 text-sm mt-1"
              role="alert"
            >
              {errors.email.message}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="login-password" className="block font-medium mb-1">
            패스워드
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="off"
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? 'login-password-error' : undefined
              }
              {...register('password', {
                required: '패스워드를 입력하세요',
              })}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
                errors.password
                  ? 'border-red-500 ring-red-300'
                  : 'border-gray-300 focus:ring-blue-300'
              }`}
            />
            <button
              type="button"
              onClick={toggle}
              className={tw(
                'cursor-pointer',
                'absolute right-1 top-1/2',
                '-translate-y-1/2',
                'rounded border-0',
                'px-2 py-1',
                'text-sm text-gray-600 bg-gray-50',
                'hover:bg-gray-200',
                'focus:outline-none focus:ring focus:ring-blue-300'
              )}
              aria-label={showPassword ? '패스워드 숨기기' : '패스워드 표시'}
              title={showPassword ? '패스워드 숨기기' : '패스워드 표시'}
            >
              {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
          {errors.password && (
            <div
              id="login-password-error"
              className="text-red-500 text-sm mt-1"
              role="alert"
            >
              {errors.password.message}
            </div>
          )}
        </div>
        <button
          type="submit"
          aria-disabled={isSubmitting}
          className={tw(
            'cursor-pointer',
            'w-full border-0 py-3 rounded',
            'border-1 border-blue-600',
            'bg-blue-600 text-white',
            'hover:bg-blue-700',
            'focus:bg-blue-800 focus:border-blue-800',
            'aria-disabled:cursor-not-allowed aria-disabled:opacity-50'
          )}
        >
          {isSubmitting ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>
  )
}
