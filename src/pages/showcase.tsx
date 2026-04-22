import type {ReactElement} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

export default function Showcase(): ReactElement {
  return (
    <Layout
      title="前端技术展示"
      description="前端技术知识整理与技术笔记展示页面，适合作为项目演示链接。">
      <main className="py-16">
        <div className="container mx-auto px-4">
          <section className="rounded-3xl border border-gray-200 bg-white p-10 shadow-sm dark:border-gray-700 dark:bg-[#111827]">
            <Heading as="h1" className="text-4xl font-bold leading-tight">
              前端技术文档站
            </Heading>
            <p className="mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              一个面向前端工程师的知识库与技术展示站，汇总了JavaScript、浏览器、网络、React、TypeScript等核心专题，旨在展示系统性学习与技术表达能力。
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="button button--primary" to="/docs/intro">
                浏览技术笔记
              </Link>
              <Link className="button button--secondary" to="/blog">
                阅读技术文章
              </Link>
            </div>
          </section>

          <section className="mt-12 grid gap-6 lg:grid-cols-3">
            <article className="rounded-3xl border border-gray-200 bg-gray-50 p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <Heading as="h2" className="text-2xl font-semibold">
                项目亮点
              </Heading>
              <ul className="mt-5 space-y-3 text-gray-700 dark:text-gray-300">
                <li>• 系统化整理前端核心技术概念与知识要点</li>
                <li>• 基于 Docusaurus 构建，支持文档与博客内容展示</li>
                <li>• 覆盖浏览器、网络、JavaScript、React、TypeScript 等主题</li>
              </ul>
            </article>

            <article className="rounded-3xl border border-gray-200 bg-gray-50 p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <Heading as="h2" className="text-2xl font-semibold">
                技术栈
              </Heading>
              <ul className="mt-5 space-y-3 text-gray-700 dark:text-gray-300">
                <li>• React 19 / Docusaurus 3</li>
                <li>• Bun + TypeScript</li>
                <li>• Tailwind 风格样式与自定义主题</li>
              </ul>
            </article>

            <article className="rounded-3xl border border-gray-200 bg-gray-50 p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <Heading as="h2" className="text-2xl font-semibold">
                适用场景
              </Heading>
              <ul className="mt-5 space-y-3 text-gray-700 dark:text-gray-300">
                <li>• 前端技能总结与复习</li>
                <li>• 技术知识库展示与学习回顾</li>
                <li>• 项目作品链接，展示技术积累</li>
              </ul>
            </article>
          </section>

          <section className="mt-12 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-[#111827]">
            <Heading as="h2" className="text-2xl font-semibold">
              如何使用该链接
            </Heading>
            <p className="mt-4 text-gray-700 dark:text-gray-300">
              你可以将此页面作为简历中的项目链接入口，直接展示技术文档站整体结构和内容，并通过目录引导技术评审者快速了解你的核心能力。
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link className="button button--primary" to="/showcase">
                当前项目展示页面
              </Link>
              <Link className="button button--secondary" to="/docs/intro">
                进入文档主页
              </Link>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}
