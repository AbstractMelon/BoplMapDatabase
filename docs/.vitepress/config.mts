import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Map Maker Docs',
  description: 'The docs for the map maker bopl mod!',
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  base: '/MapMakerDocs/',
  ignoreDeadLinks: true,
  themeConfig: {
    siteTitle: 'Map Maker Docs',
    logo: '/logo.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Lua Docs', link: '/lua/' },
      { text: 'Tips', link: '/tips/' },
      { text: 'Troubleshooting', link: '/troubleshooting/' },
      { text: 'Development', link: '/development/' },
      { text: 'Links', link: '/links/' },
      { text: 'Credits', link: '/credits/' }
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Lua Docs', link: '/lua/' },
          { text: 'Tips', link: '/tips/' },
          { text: 'Troubleshooting', link: '/troubleshooting/' },
          { text: 'Development', link: '/development/' },
          { text: 'Links', link: '/links/' },
          { text: 'Credits', link: '/credits/' }
        ]
      },
      {
        text: 'Lua Documentation',
        items: [
          { text: 'Overview', link: '/lua/' },
          { text: 'Sequence', link: '/lua/sequence' },
          { text: 'Notes', link: '/lua/notes' },
          { text: 'Global Functions', link: '/lua/global-functions' },
          { text: 'Player Methods', link: '/lua/player-functions' },
          { text: 'Platform Methods', link: '/lua/platform-functions' },
          { text: 'BoplBody Methods', link: '/lua/boplbody-functions' },
          { text: 'Errors', link: '/lua/errors' },
          { text: 'Utilities & Constants', link: '/lua/utilities' },
          { text: 'Default Lua APIs', link: '/lua/default-lua-apis' }
        ]
      }      
    ]
  }
})
