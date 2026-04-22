import type {ReactElement} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className="hero hero--primary py-16 text-center md:py-10">
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link className="button button--secondary button--lg" to="/docs/intro">
            从高频题开始
          </Link>
          <Link className="button button--outline button--lg" to="/docs/guide/study-plan">
            看学习路线
          </Link>
        </div>
      </div>
    </header>
  );
}

function QuickNav(): ReactElement {
  const items = [
    {title: 'JavaScript', desc: '作用域、闭包、原型链、事件循环', to: '/docs/frontend/javascript/closure'},
    {title: '浏览器', desc: '存储、渲染、性能与安全基础', to: '/docs/frontend/browser/storage'},
    {title: '网络', desc: 'HTTP、缓存、TCP 与请求链路', to: '/docs/frontend/network/http-cache'},
  ];

  return (
    <section className="py-10">
      <div className="container">
        <div className="mb-5 flex items-end justify-between">
          <Heading as="h2" className="mb-0 text-2xl font-bold">
            高频模块入口
          </Heading>
          <Link to="/docs/intro">查看全部题目</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className="rounded-lg border border-solid border-gray-200 p-5 no-underline transition hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md dark:border-gray-700">
              <div className="text-lg font-semibold text-inherit">{item.title}</div>
              <p className="mb-0 mt-2 text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactElement {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title={`${siteConfig.title} - 首页`} description="前端技术知识整理与学习路径">
      <HomepageHeader />
      <main>
        <QuickNav />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
