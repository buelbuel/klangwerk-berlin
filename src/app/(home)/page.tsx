import { Product } from "@/types/product";
import Image from "next/image";
import { Pool } from "pg";

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Fly.io PostgreSQL URL
});

async function getProducts(): Promise<Product[]> {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT id, name, price, image FROM products");
        return result.rows;
    } finally {
        client.release();
    }
}

export default async function Home() {
    const products = await getProducts();

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Products</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4 shadow">
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={300}
                            height={200}
                            className="rounded-lg"
                        />
                        <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
                        <p className="text-gray-600">{product.price}€</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
