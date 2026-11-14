declare module '#app' {
  interface PageMeta {
    /** Header title of the screen. */
    title?: string
    /** Show a back arrow in the header. */
    back?: boolean
    /** false hides the bottom tab bar. */
    tabs?: boolean
  }
}
export {}
