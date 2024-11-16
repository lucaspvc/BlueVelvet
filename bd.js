
const simulatedUsers = [
        { name: "Admin", email: "admin@bluevelvet.com", password: "admin123", role: "Administrador" },
        { name: "John Doe", email: "john@bluevelvet.com", password: "john1234", role: "Diretor de vendas" },
        { name: "Jane Smith", email: "jane@bluevelvet.com", password: "jane1234", role: "Editor" },
];


localStorage.setItem('users', JSON.stringify(simulatedUsers));

// Lista inicial de produtos
const initialProducts = [
    { id: 1, image: "images/img1.jpg", name: "Guided by Voices - Bee Thousand", brand: "Matador Records", category: "CD" },
    { id: 2, image: "images/img2.jpg", name: "Pavement - Slanted and Enchanted", brand: "Domino Recording Co", category: "MP3" },
    { id: 3, image: "images/img3.jpg", name: "Neutral Milk Hotel T-Shirt", brand: "Merge Records", category: "T-Shirt" },
    { id: 4, image: "images/img4.jpg", name: "Indie Rock 101", brand: "Music Books", category: "Book" },
    { id: 5, image: "images/img5.jpg", name: "The Jesus and Mary Chain Poster", brand: "Art & Prints", category: "Poster" },
    { id: 6, image: "images/img6.jpg", name: "Album XYZ", brand: "Brand 1", category: "Vinyl" },
    { id: 7, image: "images/img7.jpg", name: "Tote Bag", brand: "Accessories", category: "Merchandise" },
    { id: 8, image: "images/img8.jpg", name: "Headphones", brand: "Tech", category: "Electronics" },
    { id: 9, image: "images/img9.jpg", name: "Guitar Picks", brand: "Music Accessories", category: "Accessories" },
    { id: 10, image: "images/img10.jpg", name: "Band Poster", brand: "Art & Prints", category: "Poster" },
];

localStorage.setItem('products', JSON.stringify(initialProducts));