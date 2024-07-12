export const dummyCall = new Promise((resolve) => {
    setTimeout(() => {
        resolve({ msg: 'DONE' });
    }, 5000);
});
