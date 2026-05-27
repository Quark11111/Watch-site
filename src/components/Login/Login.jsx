import { useState } from 'react'
import { useAuth } from '../../../auth';
import { useNavigate } from 'react-router-dom';
import { loginEmail } from '../../../authServices';
import '../../styles/Login.css'

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await loginEmail(email, password);
            alert('Успешный вход!');
            navigate('/profile')
        } catch (error) {
            alert(error.message);
        }
    }

    return (
    <section>
        <form className='login' onSubmit={handleSubmit}>
            <div className='login-name'>Войти в аккаунт</div>
            <input className='email' type="email" placeholder='Email' onChange={e => setEmail(e.target.value)} required/>
            <input className='password' type="password" placeholder='Пароль' onChange={e => setPassword(e.target.value)} required />
            <button type='submit' className='login-from-login'>Войти</button>

            <div className='register-from-login-div'>Впервые тут?: <button className='register-from-login' onClick={() => navigate('/register')}>Создать аккаунт</button></div>
        </form>
    </section>
    )
}