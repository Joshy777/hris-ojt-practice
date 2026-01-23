export async function login(page) {
  await page.goto('https://s1.yahshuahris.com/');

  await page.getByRole('button', { name: 'Get Started' }).nth(1).click();
  await page.getByRole('link', { name: 'Sign In' }).first().click();

  await page.getByRole('textbox', { name: 'Email' })
    .fill('paulandrewnerona@gmail.com');

  await page.getByRole('textbox', { name: 'Password' })
    .fill('AndrewNeronz@13');

  await page.getByRole('button', { name: 'Sign in' }).click();
}
