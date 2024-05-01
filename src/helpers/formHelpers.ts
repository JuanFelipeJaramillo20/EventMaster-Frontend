export const addErrorInput = (id: string) => {
  const invalidInput = document.getElementById(id);
  if (!invalidInput) return;
  invalidInput?.classList.add('invalid--input');
  invalidInput.style.animation = 'invalid-bounce 0.2s ease';
  setTimeout(() => {
    invalidInput.style.animation = '';
  }, 200);
};

export const removeErrorInput = (id: string) => {
  const validInput = document.getElementById(id);
  if (!validInput) return;
  validInput?.classList.remove('invalid--input');
  validInput.style.animation = '';
};
