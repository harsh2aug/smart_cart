// Remove the password hash before a merchant is sent to the browser
export function withoutPassword(merchant) {
  const { passwordHash: _passwordHash, ...rest } = merchant;
  return rest;
}
