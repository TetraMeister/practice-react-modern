import React, { useRef, useReducer } from 'react';

function ContactForm() {
    const fields = ['form_name', 'form_email', 'form_tel', 'form_subject', 'form_message'];

    const init = fields.reduce((acc, el) => {
        acc[el] = '';
        return acc;
    }, {});

    const reducer = (state, action) => {
        if (action.type === 'RESET') return init;
        const newState = { ...state, [action.name]: action.value };
        return newState;
    };

    const [inputValues, dispatchValues] = useReducer(reducer, init);
    const [errors, dispatchErrors] = useReducer(reducer, init);

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
            if (value === '') return null;
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
                {fields.map((f) => {
                    const titleStripped = f.replace('form_', '');
                    const title = titleStripped[0].toLocaleUpperCase() + titleStripped.slice(1);

                    if (f === 'form_message') {
                        return (
                            <div key={f}>
                                <label htmlFor={f}>{title}</label>
                                <textarea
                                    id={f}
                                    name={f}
                                    onChange={(ev) => handleChange(ev)}
                                    value={inputValues[f]}
                                />
                            </div>
                        );
                    }
                    return (
                        <div key={f}>
                            <label htmlFor={f}>{title}</label>
                            <input
                                id={f}
                                name={f}
                                onChange={(ev) => handleChange(ev)}
                                value={inputValues[f]}
                            />
                        </div>
                    );
                })}
                <input type="submit" value="Send" />
            </form>
            {JSON.stringify(init) !== JSON.stringify(errors) && <ul>{generateErrorsElements()}</ul>}
        </div>
    );
}

export default ContactForm;
