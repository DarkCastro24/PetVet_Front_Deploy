import Image from 'react-bootstrap/Image';
import loginImage from "../assets/images/login/login-image.jpg"
import logoImage from "../assets/images/logoHeader.png"
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';


function Login() {
     const API_URL = import.meta.env.VITE_API_URL;


    const { register, handleSubmit, formState: { errors } } = useForm();

    const navigate = useNavigate();

    const onSubmit = async data => {
        try {
            const response = await fetch(`${API_URL}/api/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                console.error('Login fallido:', result.message);
                return;
            }

            localStorage.setItem('token', result.token);

            localStorage.setItem('role_id', result.user.role_id);

            localStorage.setItem('user', JSON.stringify(result.user));

            //Manda a otra vista segun su rol del user

            if (result.user.role_id === 1) {
                navigate('/citas', { replace: true });
            } else if (result.user.role_id === 2) {
                navigate('/expediente', { replace: true });
            } else {
                navigate('/', { replace: true });
            }

        } catch (error) {
            console.error('Error al enviar datos', error);
        }
    };




    return (
        <div id="main-container">
            <div id='image-container'>
                <Image src={loginImage} fluid width={250} height={100} />
            </div>

            <div id='fields-container'>
                <div id='logo-container'>
                    <Image src={logoImage} fluid width={345} height={200} />

                </div>

                <h4 >¡Bienvenido!</h4>



                <form action="submit" onSubmit={handleSubmit(onSubmit)}>
                    <label htmlFor="correo"> Correo electrónico</label>
                    <input type="text" id="correo" {...register("email", { required: "Email is required" })} />
                    {errors.email && <p>{errors.email.message}</p>}
                    <label htmlFor="password"> Contraseña</label>
                    <input type="password" id="password"  {...register('password', { required: 'Password is required' })} />
                    <button>
                        Iniciar Sesión
                    </button>
                </form>
                <div id='register-link'>
                    <a href="/register"> ¿No tienes una cuenta? Regístrate</a>
                </div>

            </div>
        </div>
    )
}

export default Login