const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

// Инициализируем Admin SDK для полного доступа к вашей БД Firestore на сервере
admin.initializeApp();
const db = admin.firestore();

/**
 * Защищенная функция создания заказа.
 * Принимает от клиента (React) ТОЛЬКО { productId: "ID_ТОВАРА" }
 */
exports.createNewOrder = onCall(async (request) => {
    // 1. ЗАЩИТА: Проверяем, авторизован ли пользователь в системе
    if (!request.auth) {
        throw new HttpsError(
            "unauthenticated", 
            "Действие запрещено. Пожалуйста, войдите в свой аккаунт."
        );
    }

    // Извлекаем уникальный ID пользователя и переданный ID часов
    const uid = request.auth.uid;
    const { productId } = request.data;

    // Проверяем, передал ли фронтенд ID товара
    if (!productId) {
        throw new HttpsError(
            "invalid-argument", 
            "Невозможно оформить заказ: отсутствует идентификатор товара."
        );
    }

    try {
        // 2. ЗАЩИТА: Сервер САМ идет в Firestore за ценой. Клиент не может ее подменить!
        const productDoc = await db.collection("products").doc(productId).get();

        // Проверяем, существуют ли такие часы в базе данных
        if (!productDoc.exists) {
            throw new HttpsError(
                "not-found", 
                "Товар не найден в базе данных сайта."
            );
        }

        const productData = productDoc.data();
        
        // Берем официальные данные и цену строго из вашего Firestore
        const officialPrice = Number(productData.price);
        const productName = productData.name || "Швейцарские часы";
        const productTitle = productData.title || "";
        const productImg = productData.img || "";

        // 3. Формируем структуру защищенного заказа
        const newOrder = {
            productId: productId,
            productName: productName,
            productTitle: productTitle,
            productImg: productImg,
            totalPrice: officialPrice, // Эту цену хакер изменить не сможет
            createdAt: admin.firestore.FieldValue.serverTimestamp(), // Время сервера
            status: "В обработке"
        };

        // 4. Записываем заказ в подколлекцию пользователя: users/uid/orders/
        const orderRef = await db
            .collection("users")
            .doc(uid)
            .collection("orders")
            .add(newOrder);

        // Возвращаем клиенту успешный ответ и ID созданного чека
        return { 
            success: true, 
            orderId: orderRef.id 
        };

    } catch (error) {
        console.error("Критическая ошибка на сервере при создании заказа:", error);
        throw new HttpsError("internal", "Ошибка сервера: " + error.message);
    }
});
