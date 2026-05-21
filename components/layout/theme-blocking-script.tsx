type Props = {
  defaultTheme: "light" | "dark" | "system";
};

/**
 * Runs before React hydrates to apply CMS default theme when the visitor has no saved preference.
 * Prevents light/dark flash on first paint.
 */
export function ThemeBlockingScript({ defaultTheme }: Props) {
  const script = `
(function () {
  try {
    var key = 'theme';
    if (localStorage.getItem(key)) return;
    var theme = ${JSON.stringify(defaultTheme)};
    if (theme === 'system') {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    var root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  } catch (e) {}
})();
`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
