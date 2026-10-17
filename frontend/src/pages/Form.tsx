import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api/config";

type Post = {
  id: number;
  title: string;
  content: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    axios
      .get<Post[]>(`${API_BASE_URL}/posts`)
      .then((res) => setPosts(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
      <div className="w-full bg-blue-100 max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          📌 Daftar Postingan
        </h1>

        {posts.length === 0 ? (
          <p className="text-gray-500 text-center">Belum ada postingan.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {post.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">{post.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
