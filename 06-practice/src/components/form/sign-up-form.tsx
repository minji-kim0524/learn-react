import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { useToggleState } from '@/hooks'
import supabase from '@/libs/supabase'
import { navigate, tw } from '@/utils'

type SignupFormData = {
  name: string
  email: string
  password: string
  password2: string
  bio?: string
}

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignupFormData>({
    mode: 'onChange',
  })

  const [showPassword1, { toggle: togglePassword1 }] = useToggleState(false)
  const [showPassword2, { toggle: togglePassword2 }] = useToggleState(false)

  const onSubmit = async (formData: SignupFormData) => {
    if (isSubmitting) return

    const { error, data } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,

      options: {
        data: {
          username: formData.name,
          bio: formData.bio,
        },
      },
    })

    if (error) {
      toast.error(
        `회원가입 인증 오류 발생! [${error.status}:${error.name}:${error.message}]`
      )
    } else {
      if (data.user) {
        const { error } = await supabase.from('profiles').insert({
          id: data.user.id,
          username: data.user.user_metadata.username,
          email: data.user.user_metadata.email,
          bio: data.user.user_metadata.bio,
          created_at: new Date().toISOString(),
        })

        if (error) {
          toast.error(
            '프로필 테이블 추가 오류 발생! [${error.status}:${error.name}:${error.message}]'
          )
        } else {
          toast.success('회원가입에 성공했습니다!')

          navigate('signin')

          reset()
        }
      }
    }
  }

  const password = watch('password')

  return (
    <div className="max-w-md w-100 mx-auto bg-white rounded-lg p-4">
      <h2 className="text-xl font-bold mb-6 text-center">회원가입</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        aria-label="회원가입 폼"
        autoComplete="off"
        noValidate
      >
        <div className="mb-4">
          <label htmlFor="signup-name" className="block font-medium mb-1">
            이름
          </label>
          <input
            id="signup-name"
            type="text"
            autoComplete="off"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'signup-name-error' : undefined}
            {...register('name', { required: '이름을 입력하세요' })}
            className={tw(
              'w-full px-3 py-2 border rounded focus:outline-none focus:ring',
              errors.name
                ? 'border-red-500 ring-red-300'
                : 'border-gray-300 focus:ring-blue-300'
            )}
          />
          {errors.name && (
            <div
              role="alert"
              id="signup-name-error"
              className="text-red-500 text-sm mt-1"
            >
              {errors.name.message}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="signup-email" className="block font-medium mb-1">
            이메일
          </label>
          <input
            type="email"
            id="signup-email"
            autoComplete="off"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'signup-email-error' : undefined}
            {...register('email', {
              required: '이메일을 입력하세요',
              pattern: {
                value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                message: '올바른 이메일 형식이 아닙니다.',
              },
            })}
            className={tw(
              'w-full px-3 py-2 border rounded focus:outline-none focus:ring',
              errors.email
                ? 'border-red-500 ring-red-300'
                : 'border-gray-300 focus:ring-blue-300'
            )}
          />
          {errors.email && (
            <div
              id="signup-email-error"
              className="text-red-500 text-sm mt-1"
              role="alert"
            >
              {errors.email.message}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="signup-bio" className="block font-medium mb-1">
            소개 (선택)
          </label>
          <textarea
            id="signup-bio"
            autoComplete="off"
            aria-describedby={errors.bio ? 'signup-bio-error' : undefined}
            {...register('bio')}
            rows={3}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring border-gray-300 focus:ring-blue-300 resize-none"
            placeholder="자신을 간단히 소개해 주세요"
          />
          {errors.bio && (
            <div
              id="signup-bio-error"
              className="text-red-500 text-sm mt-1"
              role="alert"
            >
              {errors.bio.message}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="signup-password" className="block font-medium mb-1">
            패스워드
          </label>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword1 ? 'text' : 'password'}
              autoComplete="off"
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? 'signup-password-error' : undefined
              }
              {...register('password', {
                required: '패스워드를 입력하세요.',
                minLength: {
                  value: 6,
                  message: '6자 이상 입력하세요.',
                },
                validate: (value: string) => {
                  if (!/[a-z]/.test(value))
                    return '영문 소문자가 하나 이상 포함되어야 합니다.'
                  if (!/[A-Z]/.test(value))
                    return '영문 대문자가 하나 이상 포함되어야 합니다.'
                  if (!/[0-9]/.test(value))
                    return '숫자가 하나 이상 포함되어야 합니다.'
                },
              })}
              className={tw(
                'w-full px-3 py-2 border rounded focus:outline-none focus:ring pr-12',
                errors.password
                  ? 'border-red-500 ring-red-300'
                  : 'border-gray-300 focus:ring-blue-300'
              )}
            />

            <button
              type="button"
              aria-label={showPassword1 ? '패스워드 감춤' : '패스워드 표시'}
              title={showPassword1 ? '패스워드 감춤' : '패스워드 표시'}
              aria-pressed={showPassword1}
              onClick={togglePassword1}
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
            >
              {showPassword1 ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
          {errors.password && (
            <div
              id="signup-password-error"
              className="text-red-500 text-sm mt-1"
              role="alert"
            >
              {errors.password.message}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="signup-password2" className="block font-medium mb-1">
            패스워드 확인
          </label>
          <div className="relative">
            <input
              id="signup-password2"
              type={showPassword2 ? 'text' : 'password'}
              autoComplete="off"
              aria-invalid={!!errors.password2}
              aria-describedby={
                errors.password2 ? 'signup-password2-error' : undefined
              }
              {...register('password2', {
                required: '패스워드 확인을 입력하세요',
                validate: (v) =>
                  v === password || '패스워드가 일치하지 않습니다',
              })}
              className={tw(
                'w-full px-3 py-2 border rounded focus:outline-none focus:ring pr-12',
                errors.password2
                  ? 'border-red-500 ring-red-300'
                  : 'border-gray-300 focus:ring-blue-300'
              )}
            />

            <button
              type="button"
              aria-label={showPassword2 ? '패스워드 감춤' : '패스워드 표시'}
              title={showPassword2 ? '패스워드 감춤' : '패스워드 표시'}
              aria-pressed={showPassword2}
              onClick={togglePassword2}
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
            >
              {showPassword2 ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
          {errors.password2 && (
            <div
              id="signup-password2-error"
              className="text-red-500 text-sm mt-1"
              role="alert"
            >
              {errors.password2.message}
            </div>
          )}
        </div>
        <button
          type="submit"
          aria-disabled={isSubmitting}
          className={tw(
            'cursor-pointer',
            'w-full bg-blue-600 border-1 border-blue-600 text-white py-3 rounded',
            'hover:bg-blue-700',
            'focus:bg-blue-800 focus:border-blue-800',
            'aria-disabled:cursor-not-allowed aria-disabled:opacity-50'
          )}
        >
          {isSubmitting ? '가입 중...' : '회원가입'}
        </button>
      </form>
    </div>
  )
}
