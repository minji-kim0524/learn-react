import js from '@eslint/js'
import pluginJsxA11y from 'eslint-plugin-jsx-a11y'
import pluginPrettierRecommand from 'eslint-plugin-prettier/recommended'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'

export default defineConfig([
  // 'dist' 폴더 전체를 ESLint 검사에서 제외 (빌드된 결과물 무시)
  globalIgnores(['dist']),

  {
    // 검사할 파일(src 폴더 내 js,jsx) 패턴 지정
    files: ['src/**/*.{js,jsx}'],

    // 사용할 플러그인 등록
    plugins: { js },

    // 규칙 확장: js 추천 규칙 세트 적용
    extends: ['js/recommended'],

    settings: {
      // React 버전 자동 감지 후 관련 규칙 적용
      react: {
        version: 'detect',
      },
    },

    languageOptions: {
      globals: {
        // 브라우저와 Node 환경의
        // 전역 객체를 모두 사용 가능하도록 설정
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // React의 JSX 런타임(automatic) 설정
  pluginReact.configs.flat['jsx-runtime'],
  // JSX 접근성(Accessibility) 권장 규칙 적용
  pluginJsxA11y.flatConfigs.recommended,
  // React Hooks의 올바른 사용을 위한 권장 규칙 적용
  pluginReactHooks.configs['recommended-latest'],
  // Prettier와 ESLint 충돌 방지 및 Prettier 포맷팅 규칙 적용
  pluginPrettierRecommand,

  {
    rules: {
      // 정의되지 않은 변수 사용 금지
      'no-undef': 'error',

      // var 사용 금지
      // - ES6+ let/const 사용 강제
      // - 호이스팅 문제 및 스코프 혼란 방지
      'no-var': 'error',

      // const 선호
      // - 재할당되지 않는 변수는 const 사용 강제
      // - 코드 안정성 향상 및 의도치 않은 변수 변경 방지
      'prefer-const': 'error',

      // 미사용 변수 제거
      // - 코드 정리 및 메모리 최적화
      // - 밑줄(_)로 시작하는 매개변수는 예외 처리 (의도적 미사용)
      'no-unused-vars': [
        'error',
        { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' },
      ],

      // 중복 import 방지
      // - 동일 모듈의 여러 import 문 금지
      // - 번들 크기 최적화 및 코드 정리
      'no-duplicate-imports': 'error',

      // 정의되지 않은 JSX 컴포넌트 사용 감지
      'react/jsx-no-undef': 'error',

      // React 프로퍼티 타입 검사 비활성화
      // - TypeScript 사용 환경에서는 불필요
      // - React 17+ 버전에서는 PropTypes 사용 빈도가 낮음
      'react/prop-types': 'off',

      // JSX 내 단일 요소 줄바꿈 강제화
      // - 코드 가독성 향상
      // - 복잡한 JSX 구조에서 일관성 유지
      'react/jsx-wrap-multilines': 'error',

      // JSX 컴포넌트의 올바른 명명 규칙 강제
      // - PascalCase 형식 사용 (예: MyComponent)
      // - DOM 요소와 컴포넌트 구분 용이
      'react/jsx-pascal-case': 'error',

      // Prettier 규칙
      'prettier/prettier': [
        'error',
        {
          trailingComma: 'es5',

          // JSX 요소인 경우, 규칙 덮어쓰기
          overrides: [
            {
              files: '*.jsx',
              options: {
                trailingComma: 'none',
              },
            },
          ],
        },
      ],

      // 화살표 함수 본문 스타일
      // - 간결한 표현식 강제
      // - 단일 표현식일 때 중괄호와 return 생략 강제
      // 'arrow-body-style': ['error', 'as-needed'],

      // 콘솔 사용 제한
      // - 디버깅용 console.log 남용 방지
      // - warn, error만 허용하여 프로덕션 코드 품질 향상
      // 'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
])
