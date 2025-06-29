import { useState, useEffect } from "react";
import { Card, Row, Col, Badge, Button, Empty, Modal } from "antd";
import {
  ShoppingCart,
  Heart,
  Plus,
  Minus,
  Trash2,
  X,
} from "lucide-react";
import freshline from "./assets/freshline.png"

const mockVegetables = [
  {
    id: 1,
    title: "Pomidor",
    price: 1000,
    description: "Yangi uzilgan pomidor",
    image:
      "https://avatars.mds.yandex.net/i?id=fcb4174cc4343c06a13a655c29c69c14_l-4080501-images-thumbs&n=13",
  },
  {
    id: 2,
    title: "Bodring",
    price: 2500,
    description: "Tabiiy bodring",
    image: "https://i.ytimg.com/vi/ftjZHLOqhYY/maxresdefault.jpg",
  },
  {
    id: 3,
    title: "Kartoshka",
    price: 5000,
    description: "Yangi hosil kartoshka",
    image:
      "https://avatars.mds.yandex.net/i?id=49a7806d7e0e85a7d9fbb76d1377927e7c3893c7-4451422-images-thumbs&n=13",
  },
  {
    id: 4,
    title: "Sabzi",
    price: 3000,
    description: "Shirin sabzi",
    image:
      "https://avatars.mds.yandex.net/i?id=f9e5d7b8466ec2e148c3d00388223da460f54fb1-5875921-images-thumbs&n=13",
  },
  {
    id: 5,
    title: "Piyoz",
    price: 3000,
    description: "Yangi piyoz",
    image:
      "https://fazenda.net.ua/image/cache/catalog/img-tovar/semena/luk/Balstar__/balstar1-800x800.jpg",
  },
  {
    id: 6,
    title: "Balgar",
    price: 7000,
    description: "Mazzali balgarski",
    image:
      "https://avatars.mds.yandex.net/get-mpic/4120567/2a0000018c411c2126289b180c8b880abaeb/orig",
  },
];

const App = () => {
  const [products] = useState(mockVegetables);
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("buyer_cart");
    return stored ? JSON.parse(stored) : {};
  });

  const [liked, setLiked] = useState(() => {
    const stored = localStorage.getItem("buyer_liked");
    return stored ? JSON.parse(stored) : [];
  });

  const [openCart, setOpenCart] = useState(false);
  const [openLikesModal, setOpenLikesModal] = useState(false);

  const toggleLike = (item) => {
    setLiked((prev) =>
      prev.includes(item.id)
        ? prev.filter((id) => id !== item.id)
        : [...prev, item.id]
    );
  };

  const addCart = (item) => {
    setCart((prev) => {
      const entry = prev[item.id] || { ...item, qty: 0 };
      return { ...prev, [item.id]: { ...entry, qty: entry.qty + 1 } };
    });
  };

  const increaseQty = (id) => {
    setCart((prev) => ({
      ...prev,
      [id]: { ...prev[id], qty: prev[id].qty + 1 },
    }));
  };

  const decreaseQty = (id) => {
    setCart((prev) => {
      const qty = prev[id].qty - 1;
      if (qty <= 0) {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      }
      return { ...prev, [id]: { ...prev[id], qty } };
    });
  };

  const deleteItem = (id) => {
    const updated = { ...cart };
    delete updated[id];
    setCart(updated);
  };

  const removeLiked = (id) => {
    setLiked((prev) => prev.filter((x) => x !== id));
  };

  const totalPrice = Object.values(cart).reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );

  useEffect(() => {
    localStorage.setItem("buyer_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("buyer_liked", JSON.stringify(liked));
  }, [liked]);

  return (
    <div className="min-h-screen bg-green-50 pb-10 ">
      <div className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <img src={freshline} alt="Logo" className="w-40 h-auto"/>
        <div className="flex items-center gap-4">
          <Badge count={liked.length}>
            <Heart
              size={24}
              onClick={() => setOpenLikesModal(true)}
              className={`cursor-pointer ${
                liked.length > 0
                  ? "text-red-600 fill-red-600"
                  : "text-gray-500 hover:text-red-500"
              }`}
            />
          </Badge>
          <Badge count={Object.keys(cart).length}>
            <ShoppingCart
              size={24}
              className="text-grey-600 cursor-pointer hover:text-green-700"
              onClick={() => setOpenCart(true)}
            />
          </Badge>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-center my-6 text-green-700">
        🥬 Sabzavotlar ro'yxati
      </h2>

      <Row gutter={[16, 16]} className="px-6">
        {products.map((item) => (
          <Col xs={24} sm={12} md={8} key={item.id}>
            <Card
              title={item.title}
              className="shadow-md rounded-xl"
              cover={
                <img
                  alt={item.title}
                  src={item.image}
                  className="rounded-2xl h-[250px] w-full object-cover p-[5px]"
                />
              }
            >
              <p className="text-gray-700 text-sm mb-2">{item.description}</p>
              <p className="text-lg font-semibold mb-4">💰 {item.price} so'm</p>
              <div className="flex justify-center gap-6">
                <Heart
                  size={20}
                  onClick={() => toggleLike(item)}
                  className={`cursor-pointer ${
                    liked.includes(item.id)
                      ? "text-red-600 fill-red-600"
                      : "text-gray-400 hover:text-red-500"
                  }`}
                />
                <ShoppingCart
                  size={20}
                  onClick={() => addCart(item)}
                  className="text-grey-600 cursor-pointer hover:text-green-700"
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title="🛒 Savatcha"
        open={openCart}
        onCancel={() => setOpenCart(false)}
        footer={null}
        width={600}
      >
        {Object.keys(cart).length === 0 ? (
          <Empty description="Savatcha bo‘sh" />
        ) : (
          <>
            {Object.values(cart).map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b py-2"
              >
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-600">
                    {item.qty} x {item.price} so'm
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="small"
                    onClick={() => decreaseQty(item.id)}
                    icon={<Minus size={14} />}
                  />
                  <span>{item.qty}</span>
                  <Button
                    size="small"
                    onClick={() => increaseQty(item.id)}
                    icon={<Plus size={14} />}
                  />
                  <Button
                    danger
                    size="small"
                    onClick={() => deleteItem(item.id)}
                    icon={<Trash2 size={14} />}
                  />
                </div>
              </div>
            ))}
            <div className="text-right mt-4 font-bold text-lg">
              Jami: {totalPrice} so'm
            </div>
          </>
        )}
      </Modal>

      <Modal
        title="❤️ Yoqtirgan mahsulotlar"
        open={openLikesModal}
        onCancel={() => setOpenLikesModal(false)}
        footer={null}
        width={600}
      >
        {liked.length === 0 ? (
          <Empty description="Yoqtirgan mahsulotlar yo‘q" />
        ) : (
          <Row gutter={[16, 16]}>
            {products
              .filter((item) => liked.includes(item.id))
              .map((item) => (
                <Col span={12} key={item.id}>
                  <Card
                    size="small"
                    title={item.title}
                    extra={
                      <X
                        size={18}
                        onClick={() => removeLiked(item.id)}
                        className="text-gray-400 hover:text-red-500 cursor-pointer"
                      />
                    }
                    cover={
                      <img
                        src={item.image}
                        alt={item.title}
                        className="rounded-md h-[150px] object-cover w-full"
                      />
                    }
                  >
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <p className="text-base font-semibold mt-2">
                      💰 {item.price} so'm
                    </p>
                  </Card>
                </Col>
              ))}
          </Row>
        )}
      </Modal>
    </div>
  );
};

export default App;
