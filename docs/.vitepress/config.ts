import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Android Knowledge Hub',
  description: 'Tổng hợp kiến thức Android có cấu trúc, dễ tra cứu và cập nhật',
  base: '/android-knowledge/',
  themeConfig: {
    nav: [
      { text: 'Trang chủ', link: '/' },
      { text: 'Roadmap', link: '/roadmap' }
    ],
    sidebar: [
      {
        text: 'Nền tảng',
        items: [
          { text: 'Kotlin', link: '/foundation/kotlin' },
          { text: 'OOP', link: '/foundation/oop' },
          { text: 'Coroutines', link: '/foundation/coroutines' }
        ]
      },
      {
        text: 'Android Core',
        items: [
          { text: 'Activity & Fragment', link: '/android-core/activity-fragment' },
          { text: 'Lifecycle', link: '/android-core/lifecycle' },
          { text: 'Intents', link: '/android-core/intents' },
          { text: 'Permissions', link: '/android-core/permissions' }
        ]
      },
      {
        text: 'UI',
        items: [
          { text: 'XML Views', link: '/ui/xml' },
          { text: 'Jetpack Compose', link: '/ui/jetpack-compose' },
          { text: 'Navigation', link: '/ui/navigation' }
        ]
      },
      {
        text: 'Architecture',
        items: [
          { text: 'MVVM', link: '/architecture/mvvm' },
          { text: 'Clean Architecture', link: '/architecture/clean-architecture' },
          { text: 'Modularization', link: '/architecture/modularization' }
        ]
      },
      {
        text: 'Data',
        items: [
          { text: 'Room', link: '/data/room' },
          { text: 'DataStore', link: '/data/datastore' },
          { text: 'Retrofit', link: '/data/retrofit' },
          { text: 'Paging', link: '/data/paging' }
        ]
      },
      {
        text: 'Performance',
        items: [
          { text: 'Memory', link: '/performance/memory' },
          { text: 'Startup', link: '/performance/startup' },
          { text: 'Profiling', link: '/performance/profiling' }
        ]
      },
      {
        text: 'Testing',
        items: [
          { text: 'JUnit', link: '/testing/junit' },
          { text: 'UI Testing', link: '/testing/ui-testing' },
          { text: 'MockK', link: '/testing/mockk' }
        ]
      },
      {
        text: 'Interview',
        items: [
          { text: 'Android Questions', link: '/interview/android-questions' },
          { text: 'System Design', link: '/interview/system-design' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuphong0x/android-knowledge' }
    ]
  }
})