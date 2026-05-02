import React, { useRef, useReducer } from 'react';

function ContactForm() {
    const initValues = {
        form_name: '',
        form_email: '',
        form_tel: '',
        form_subject: '',
        form_message: '',
    };

    const initErrors = {
        form_name: '',
        form_email: '',
        form_tel: '',
        form_subject: '',
        form_message: '',
    };

    const reducer = (state, action) => {
        if (action.type === 'RESET') return initValues;
        const newState = { ...state, [action.name]: action.value };
        return newState;
    };

    const [inputValues, dispatchValues] = useReducer(reducer, initValues);
    const [errors, dispatchErrors] = useReducer(reducer, initErrors);

    const formRef = useRef(null);

    const validateText = (val) => {
        if (val.trim() === '') return 'This_field is required';
        return null;
    };

    const validateEmail = (val) => {
        if (val.trim() === '') return 'This_field is required';
        if (!val.includes('@')) return 'Invalid email address';
        return null;
    };

    const validateTelNr = (val) => {
        if (val.trim() === '') return 'This_field is required';
        if (!/^\d{9}$/.test(val)) return 'Invalid phone number';
        return null;
    };

    const validators = {
        form_name: validateText,
        form_email: validateEmail,
        form_tel: validateTelNr,
        form_subject: validateText,
        form_message: validateText,
    };

    const handleChange = (ev) => {
        dispatchValues({ name: ev.target.name, value: ev.target.value });
    };

    const validateForm = () => {
        const newErrors = Object.entries(inputValues).reduce((acc, [key, value]) => {
            const error = validators[key]?.(value);
            return error ? { ...acc, [key]: error } : acc;
        }, {});

        Object.entries(newErrors).forEach(([key, val]) => {
            dispatchErrors({ name: key, value: val });
        });
        return Object.keys(newErrors).length > 0;
    };

    const sendData = async () => {
        const formData = new FormData(formRef.current);
        formData.append('service_id', String(process.env.SERVICE_ID));
        formData.append('template_id', String(process.env.TEMPLATE_ID));
        formData.append('user_id', String(process.env.PUBLIC_KEY));

        try {
            const resp = await fetch('https://api.emailjs.com/api/v1.0/email/send-form', {
                method: 'POST',
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (!resp.ok) throw new Error(`Oops... Error ${resp.status} occurred :(`);
            console.log('wysłano');
        } catch (error) {
            dispatchErrors({ name: 'form', value: error.message });
        }
    };

    const handleSubmit = (ev) => {
        ev.preventDefault();
        if (!validateForm()) {
            sendData();
            dispatchValues({ type: 'RESET' });
        }
    };

    const generateErrorsElements = () => {
        const errorsListEl = Object.entries(errors).map(([key, value]) => {
            const fieldStripped = key.replace('form_', '');
            const fieldName = fieldStripped[0].toLocaleUpperCase() + fieldStripped.slice(1);
            const message = value.includes('This_field') && value.replace('This_field', fieldName);

            return <li key={key}>{message || value}</li>;
        });
        return errorsListEl;
    };

    return (
        <div>
            <form ref={formRef} onSubmit={handleSubmit}>
                <label htmlFor="name">Name and Surname</label>
                <input
                    id="name"
                    type="text"
                    name="form_name"
                    onChange={(ev) => handleChange(ev)}
                    value={inputValues.form_name}
                />

                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    name="form_email"
                    onChange={(ev) => handleChange(ev)}
                    value={inputValues.form_email}
                />

                <label htmlFor="phone">Phone</label>
                <input
                    id="phone"
                    type="tel"
                    name="form_tel"
                    onChange={(ev) => handleChange(ev)}
                    value={inputValues.form_tel}
                />

                <label htmlFor="subject">Subject</label>
                <input
                    id="subject"
                    type="text"
                    name="form_subject"
                    onChange={(ev) => handleChange(ev)}
                    value={inputValues.form_subject}
                />

                <label htmlFor="message">Message</label>
                <textarea
                    id="message"
                    name="form_message"
                    onChange={(ev) => handleChange(ev)}
                    value={inputValues.form_message}
                />

                <input type="submit" value="Send" />
            </form>
            {errors.length > 0 && <ul>{generateErrorsElements()}</ul>}
        </div>
    );
}

export default ContactForm;
