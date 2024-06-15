import { createNotification } from "../components/notification.js";
const form = document.querySelector('#form');
const nombreInput = document.querySelector('#nombre');
const emailInput = document.querySelector('#email');
const telefonoInput = document.querySelector('#telefono');
const codigo = document.querySelector('#codigo')
const passwordInput = document.querySelector('#password');
const confirmPasswordInput = document.querySelector('#confirm-password');
const formBtn = document.querySelector('#form-btn');
const notification = document.querySelector('#notification');


//Regex validations

const NAME_VALIDATION = /^[A-Z\u00d1][a-zA-Z-ÿí\u00f1\u00d1]+(\s*[A-Z\u00d1][a-zA-Z-ÿí\u00f1\u00d1\s]*)$/;
const EMAIL_VALIDATION = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const PASSWORD_VALIDATION = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;
const PHONE_VALIDATION = /^[0-9]{7}$/;

//Validaciones
let nameValidation = false;
let emailValidation = false;
let passwordValidation = false;
let phoneValidation = false;
let confirmPasswordValidation = false;

const validation = (input, regexValidation) => {
    formBtn.disabled = nameValidation && emailValidation && passwordValidation && phoneValidation && confirmPasswordValidation ? false : true;
    console.log();

    if (input.value === '') {
        input.classList.remove('outline-red-500', 'outline-2', 'outline');
        input.classList.remove('outline-green-500', 'outline-2', 'outline');
        input.classList.add('focus:outline-indigo-700');
    } else if (regexValidation) {
        input.classList.remove('outline-red-500', 'outline-2', 'outline');
        input.classList.remove('focus:outline-indigo-700');
        input.classList.add('outline-green-500', 'outline-2', 'outline');
    } else if (!regexValidation) {
        input.classList.remove('outline-green-500', 'outline-2', 'outline');
        input.classList.remove('focus:outline-indigo-700');
        input.classList.add('outline-red-500', 'outline-2', 'outline');
    }
}

//Events

nombreInput.addEventListener('input', e => {
    nameValidation = NAME_VALIDATION.test(e.target.value);
    validation(nombreInput, nameValidation);
});

emailInput.addEventListener('input', e => {
    emailValidation = EMAIL_VALIDATION.test(e.target.value);
    validation(emailInput, emailValidation);
});

telefonoInput.addEventListener('input', e => {
    phoneValidation = PHONE_VALIDATION.test(e.target.value);
    validation(telefonoInput, phoneValidation);
});

passwordInput.addEventListener('input', e => {
    passwordValidation = PASSWORD_VALIDATION.test(e.target.value);
    confirmPasswordValidation = e.target.value === confirmPasswordInput.value
    validation(passwordInput, passwordValidation);
    validation(confirmPasswordInput, confirmPasswordValidation);
});

confirmPasswordInput.addEventListener('input', e => {
    confirmPasswordValidation = e.target.value === passwordInput.value
    validation(confirmPasswordInput, confirmPasswordValidation);
});


form.addEventListener('submit', async e => {
    e.preventDefault();
    try {
        const newUser = {
            name: nombreInput.value,
            email: emailInput.value,
            phone: codigo.value + telefonoInput.value,
            password: passwordInput.value
        }
        console.log(newUser);
        const { data } = await axios.post('/api/users', newUser);
        createNotification(false, data);
        setTimeout(() => {
            notification.innerHTML = '';
        }, 5000);

        nombreInput.value = '';
        emailInput.value = '';
        codigo.value = '';
        telefonoInput.value = '';
        passwordInput.value = '';
        confirmPasswordInput.value = '';

        validation(nombreInput, false);
        validation(emailInput, false);
        validation(telefonoInput, false);
        validation(passwordInput, false);
        validation(confirmPasswordInput, false);


    } catch (error) {
        createNotification(true, error.response.data.error);
        setTimeout(() => {
            notification.innerHTML = '';
        }, 5000);

    }

})