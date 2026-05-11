import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

type AuthForm = {
  email: string
  password: string
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthForm>()

  async function onSubmit(data: AuthForm) {
    setLoading(true)
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        })
        if (error) throw error
        toast.success('환영합니다! 🍃')
      } else {
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        })
        if (error) throw error
        toast.success('회원가입 완료! 이메일을 확인해주세요 🌱')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '오류가 발생했습니다.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  function toggleMode() {
    setIsLogin((prev) => !prev)
    reset()
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `url('/bg-animal-crossing.jpg')`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md border-4 border-[#1de4ab]">
        <img
          src="/footer_navi_logo.webp"
          alt="Nookipedia"
          className="mx-auto mb-6 w-64 object-contain"
          fetchPriority="high"
        />

        <h1 className="text-center text-2xl font-bold text-[#614f34] mb-6">
          {isLogin ? '로그인' : '회원가입'}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-semibold text-[#614f34] text-sm">
              이메일
            </label>
            <input
              id="email"
              type="email"
              placeholder="이메일을 입력해주세요"
              className="border-2 border-[#1de4ab] rounded-xl p-3 outline-none focus:border-[#614f34] transition-colors bg-white"
              {...register('email', { required: '이메일을 입력해주세요' })}
            />
            {errors.email && (
              <span className="text-red-500 text-xs">{errors.email.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-semibold text-[#614f34] text-sm">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              placeholder="비밀번호를 입력해주세요 (6자 이상)"
              className="border-2 border-[#1de4ab] rounded-xl p-3 outline-none focus:border-[#614f34] transition-colors bg-white"
              {...register('password', {
                required: '비밀번호를 입력해주세요',
                minLength: { value: 6, message: '비밀번호는 6자 이상이어야 합니다' },
              })}
            />
            {errors.password && (
              <span className="text-red-500 text-xs">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#1de4ab] text-[#614f34] font-bold text-lg py-3 rounded-xl mt-2 hover:bg-[#15c994] active:translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer border-none"
          >
            {loading ? '처리 중...' : isLogin ? '로그인' : '회원가입'}
          </button>
        </form>

        <p className="text-center mt-5 text-[#614f34] text-sm">
          {isLogin ? '아직 계정이 없으신가요?' : '이미 계정이 있으신가요?'}
          {' '}
          <button
            type="button"
            onClick={toggleMode}
            className="font-bold underline bg-transparent border-none cursor-pointer text-[#614f34] hover:text-[#1de4ab] transition-colors"
          >
            {isLogin ? '회원가입' : '로그인'}
          </button>
        </p>
      </div>
    </div>
  )
}
