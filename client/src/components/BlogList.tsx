import React, { useState, useEffect } from "react";
import { blogService } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

interface Blog {
  _id: string;
  title: string;
  description: string;
  author: {
    first_name: string;
    last_name: string;
  };
  tags: string[];
  reading_time: number;
  createdAt: string;
}

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchBlogs = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await blogService.getPublishedBlogs({
        page,
        limit: 10,
      });

      const newBlogs = response.data.blogs;

      setBlogs((prevBlogs) => [...prevBlogs, ...newBlogs]);
      setHasMore(newBlogs.length > 0);
    } catch (error) {
      console.error("Failed to fetch blogs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Recent Blogs</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blogs.map((blog) => (
          <Card key={blog._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{blog.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {blog.description}
              </p>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm">
                    By {blog.author.first_name} {blog.author.last_name}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {blog.reading_time} min read
                </div>
              </div>
              <div className="mt-2">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs mr-2 mb-2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-6">
          <Button
            onClick={loadMore}
            disabled={loading}
            className="w-full md:w-auto"
          >
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}

      {!hasMore && blogs.length > 0 && (
        <p className="text-center text-muted-foreground mt-6">
          No more blogs to load
        </p>
      )}

      {blogs.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-xl text-muted-foreground">No blogs found</p>
        </div>
      )}
    </div>
  );
};

export default BlogList;
