export async function login(page) {
  await page.goto('https://s1.yahshuahris.com/login');
  await page.getByRole('textbox', { name: 'Email' })
    .fill('joba.pagapong.coc@phinmaed.com');
  await page.getByRole('textbox', { name: 'Password' })
    .fill('Ezeypagapong@777');
  await page.getByRole('button', { name: 'Sign in' }).click();
}
