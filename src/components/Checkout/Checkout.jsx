import { useState } from 'react'
import '../../styles/Checkout.css'

const Checkout = ({ product, userProfile, onClose, onConfirm }) => {
    const [step, setStep] = useState(1)
    const [cardNumber, setCardNumber] = useState('')
    const [cardName, setCardName] = useState('')
    const [cardExpiry, setCardExpiry] = useState('')
    const [cardCvv, setCardCvv] = useState('')

    const handlePayment = () => {
        if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
            alert('Заполните все поля карты!')
            return
        }
        onConfirm()
    }

    const formatCardNumber = (val) => {
        return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
    }

    const formatExpiry = (val) => {
        val = val.replace(/\D/g, '').slice(0, 4)
        if (val.length >= 2) return val.slice(0, 2) + '/' + val.slice(2)
        return val
    }

    return (
        <div className='modal-overlay' onClick={onClose}>
            <div className='modal-box' onClick={e => e.stopPropagation()}>
                <button className='modal-close' onClick={onClose}>✕</button>

                {step === 1 && (
                    <>
                        <div className='modal-title'>Подтверждение заказа</div>
                        <div className='modal-product'>
                            <img src={product.img} alt="" />
                            <div>
                                <div className='modal-product-name'>{product.name}</div>
                                <div className='modal-product-title'>{product.title}</div>
                            </div>
                        </div>
                        <div className='modal-info'>
                            <div className='modal-info-row'>
                                <span>Адрес доставки</span>
                                <span>{userProfile.address || 'Не указан'}</span>
                            </div>
                            <div className='modal-info-row'>
                                <span>Номер телефона</span>
                                <span>{userProfile.phone || 'Не указан'}</span>
                            </div>
                            <div className='modal-info-row total'>
                                <span>Сумма</span>
                                <span>{Number(product.price).toLocaleString()} ₸</span>
                            </div>
                        </div>
                        <button className='modal-btn' onClick={() => setStep(2)}>Перейти к оплате</button>
                    </>
                )}

                {step === 2 && (
                    <div className='card'>
                        <div className='modal-title'>Оплата</div>
                        <div className='card-form'>
                            <div className='card-field'>
                                <label>Номер карты</label>
                                <input type="text" placeholder='0000 0000 0000 0000' value={cardNumber} onChange={e => setCardNumber(formatCardNumber(e.target.value))} />
                            </div>
                            <div className='card-field'>
                                <label>Имя на карте</label>
                                <input type="text" placeholder='IVAN IVANOV' value={cardName} onChange={e => setCardName(e.target.value.toUpperCase())} />
                            </div>
                            <div className='card-field-row'>
                                <div className='card-field'>
                                    <label>Срок действия</label>
                                    <input type="text" placeholder='MM/YY' value={cardExpiry} onChange={e => setCardExpiry(formatExpiry(e.target.value))} />
                                </div>
                                <div className='card-field'>
                                    <label>CVV</label>
                                    <input type="password" placeholder='***' maxLength={3} value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))} />
                                </div>
                            </div>
                        </div>
                        <div className='modal-btns'>
                            <button className='modal-btn-back' onClick={() => setStep(1)}>Назад</button>
                            <button className='modal-btn' onClick={handlePayment}>Оплатить {Number(product.price).toLocaleString()} ₸</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Checkout