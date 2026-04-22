import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: '高频题优先',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        先攻克高频知识点，再扩展到中低频内容，优先保证技术掌握深度。
      </>
    ),
  },
  {
    title: '结构化回答',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        每道题统一为「定义 - 原理 - 场景 - 追问 - 误区」，便于快速复述。
      </>
    ),
  },
  {
    title: '持续复盘',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        每周进行技术复习并记录学习心得，形成可追踪的个人知识库闭环。
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className="mx-auto h-40 w-40" role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className="flex w-full items-center py-8">
      <div className="container">
        <Heading as="h2" className="mb-5 text-2xl font-bold text-center">
          整理方法
        </Heading>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
