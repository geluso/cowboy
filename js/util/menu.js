function initMenu() {
  console.log('scale');
  let scale = 4;
  MENU_CTX.scale(scale, scale);
  write(MENU_CTX, 'menu', 100, 100);
}