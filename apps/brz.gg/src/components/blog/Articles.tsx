import React from 'react';
import { blog } from '@/constants';
import useFetch from "@/hooks/useFetch";

type Articles = {
    posts: Post[];
}

type Post = {
    title: string;
    slug: string;
    feature_image: string;
    url: string;
    excerpt: string;
    reading_time: string;
}

const Articles = () => {
    const url = `${blog.baseUrl}/ghost/api/content/posts/?key=${blog.apiKey}`;
    const { data, loading, error } = useFetch<Articles>(url);

    if (loading) {
        return ( 
            <>
                <div className="group p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 dark:shadow-none dark:border-gray-700 dark:bg-gray-800 bg-opacity-50 shadow-2xl shadow-gray-600/10">
                    <div className="relative overflow-hidden rounded-xl">
                        <div className="h-64 w-full object-cover object-top transition duration-500 group-hover:scale-105">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 dark:from-transparent dark:to-gray-800 opacity-50"></div>
                        </div>
                    </div>
                </div>

                <div className="group p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 dark:shadow-none dark:border-gray-700 dark:bg-gray-800 bg-opacity-50 shadow-2xl shadow-gray-600/10">
                    <div className="relative overflow-hidden rounded-xl">
                        <div className="h-64 w-full object-cover object-top transition duration-500 group-hover:scale-105">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 dark:from-transparent dark:to-gray-800 opacity-50"></div>
                        </div>
                    </div>
                </div>

                <div className="group p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 dark:shadow-none dark:border-gray-700 dark:bg-gray-800 bg-opacity-50 shadow-2xl shadow-gray-600/10">
                    <div className="relative overflow-hidden rounded-xl">
                        <div className="h-64 w-full object-cover object-top transition duration-500 group-hover:scale-105">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 dark:from-transparent dark:to-gray-800 opacity-50"></div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if(data) {
        console.log(data.posts);
    }

    return ( 
        <>
            {error && <div>{error}</div>}
            
            {data?.posts?.length && (data.posts.map((post) => (
                <div key={post.slug} className="group p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 dark:shadow-none dark:border-gray-700 dark:bg-gray-800 bg-opacity-50 shadow-2xl shadow-gray-600/10">
                    <div className="relative overflow-hidden rounded-xl">
                        <img src={post.feature_image}
                        alt="art cover" loading="lazy" width="1000" height="667" className="h-64 w-full object-cover object-top transition duration-500 group-hover:scale-105"/>
                    </div>
                    <div className="mt-6 relative">
                        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
                            {post.title}
                        </h3>
                        <p className="mt-6 mb-8 text-gray-600 dark:text-gray-300">
                            {post.excerpt}
                        </p>
                        <a className="inline-block" href={post.url}>
                            <span className="text-info dark:text-blue-300">Leia mais</span>
                        </a>
                    </div>
                </div>
            )))} 
        </>
    );
};

export default Articles; 