import '../../styles/Registration.css'
import { useState } from 'react'
import { registerEmail } from '../../../authServices'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../auth'

const Registration = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerEmail(email, password);
            alert('Регистрация завершена!');
            navigate('/profile')
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <section>
        <form className='register' onSubmit={handleSubmit}>
            <div className='register-name'>Создать аккаунт</div>
            <input type="email" placeholder='Email' onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder='Пароль' onChange={e => setPassword(e.target.value)} required/>
            <button type='submit' className='register-from-register'>Зарегистрироваться</button>
            <div className='login-from-register-div'>Уже есть аккаунт?: <button className='login-from-register' onClick={() => navigate('/login')}>Войти</button></div>
            
        </form>
        </section>
    )
}

export default Registration