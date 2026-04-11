export default defineAppConfig({
  ui: {
    colors: {
      primary: 'brand',
      secondary: 'gold',
      neutral: 'slate'
    },
    button: {
      slots: {
        base: 'cursor-pointer'
      }
    },
    card: {
      slots: {
        root: 'rounded-2xl'
      }
    }
  }
})
