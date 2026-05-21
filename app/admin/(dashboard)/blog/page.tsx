import type { Metadata } from "next";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/options";

import { getAdminBlogPosts } from "@/lib/application/queries/admin";

import { SITE } from "@/constants/site";

import { BlogManager } from "@/components/admin/blog-manager";



export const metadata: Metadata = {

  title: `Blog | Admin | ${SITE.name}`,

  robots: { index: false, follow: false },

};



export default async function AdminBlogPage() {

  const session = await getServerSession(authOptions);

  const rows = await getAdminBlogPosts();

  return <BlogManager rows={rows} role={session!.user.role} />;

}

