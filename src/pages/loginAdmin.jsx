import Image from 'react-bootstrap/Image';
import loginImage from "../assets/images/login/login-image.jpg";
import logoImage from "../assets/images/logoHeader.png";
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;

function LoginAdmin() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async data => {
        try {
            const payload = {
                identifier: data.email,
                password: data.password,
            };

            const response = await fetch(`${API_URL}/api/admins/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                console.error('Login fallido:', result.message || result);
                return;
            }

            // 1) Guardar el token
            localStorage.setItem('token', result.token);

            // 2) Guardar el admin_type_id
            localStorage.setItem('admin_type_id', result.admin.admin_type_id);

            // 3) Guardar info del admin
            localStorage.setItem('admin', JSON.stringify(result.admin));

            // 4) Redirigir según admin_type_id
            switch (result.admin.admin_type_id) {
                case 1:
                    navigate('/admin', { replace: true });
                    break;
                case 2: 
                    navigate('/admin', { replace: true });
                    break;
                default:
                    navigate('/', { replace: true });
            }
        } catch (error) {
            console.error('Error al enviar datos', error);
        }
    };

    return (
        <div id="main-container" style={{ backgroundColor: '#ffffff', }}>
            <div id="image-container">
                <Image src={loginImage} fluid width={250} height={100} />
            </div>

            <div id="fields-container" style={{
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                width: '100%',
                flexDirection: 'column',
                justifyContent: 'center',
            }}>
                <div id="logo-container">
                    <Image src={logoImage} fluid width={345} height={200} />
                </div>

                <h4>¡Bienvenido!</h4>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <label htmlFor="correo">Usuario</label>
                    <input
                        type="text"
                        id="correo"
                        {...register("email", { required: "El usuario es requerido" })}

                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderColor: '#374f59',
                            backgroundColor: '#b0bfc2',
                            borderRadius: '50px',
                        }}
                    />
                    {errors.email && <p>{errors.email.message}</p>}

                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        {...register("password", { required: "La contraseña es requerida" })}

                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderColor: '#374f59',
                            backgroundColor: '#b0bfc2',
                            borderRadius: '50px',
                        }}
                    />
                    {errors.password && <p>{errors.password.message}</p>}

                    <button type="submit" style={{
                        width: '100%',
                        padding: '0.5rem',
                        backgroundColor: '#374f59',
                        borderRadius: '50px',
                        color: '#ffff',
                    }}>Iniciar Sesión</button>
                </form>
            </div>
        </div >
    );
}

export default LoginAdmin;
