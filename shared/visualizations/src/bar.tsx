'use client';
import Image from 'next/image';
import { CardContent, Card } from '@repo/ui/card';
import { ResponsiveBar } from '@nivo/bar';

export function BarChart() {
  return (
    <Card className="row-start-2 h-max w-full max-w-full md:max-w-3xl bg-muted-foreground text-white">
      <CardContent className="max-md:p-0">
        <BarChartImpl className="[&_svg_text]:!fill-white [&_div_span]:text-black aspect-video" />
        <a
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center gap-2 hover:bg-[#f2f2f2] hover:text-black dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
          href="https://nivo.rocks/components/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/nivo-logo.png" alt="Authjs logomark" width={24} height={24} />
          Nivo
        </a>
      </CardContent>
    </Card>
  );
}

function BarChartImpl(props: React.ComponentProps<'div'>) {
  return (
    <div {...props}>
      <ResponsiveBar
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        axisBottom={{ legend: 'country (indexBy)', legendOffset: 32 }}
        indexBy="country"
        labelSkipWidth={12}
        labelSkipHeight={12}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            translateX: 120,
            itemsSpacing: 3,
            itemWidth: 100,
            itemHeight: 16
          }
        ]}
        data={dummyData}
        keys={['hot dog', 'burger', 'sandwich', 'kebab', 'fries', 'donut']}
        padding={0.3}
        // colors={['#2563eb']}
        axisLeft={{
          tickSize: 0,
          tickValues: 4,
          tickPadding: 16
        }}
        gridYValues={4}
        theme={{
          tooltip: {
            chip: {
              borderRadius: '9999px'
            },
            container: {
              fontSize: '12px',
              textTransform: 'capitalize',
              borderRadius: '6px'
            }
          },
          grid: {
            line: {
              stroke: '#f3f4f6'
            }
          }
        }}
        tooltipLabel={({ id }) => `${id}`}
        enableLabel={false}
        role="application"
        ariaLabel="A bar chart showing data"
      />
    </div>
  );
}

const dummyData = [
  {
    country: 'AD',
    'hot dog': 159,
    burger: 173,
    sandwich: 108,
    kebab: 74,
    fries: 51,
    donut: 89
  },
  {
    country: 'AE',
    'hot dog': 115,
    burger: 150,
    sandwich: 165,
    kebab: 46,
    fries: 197,
    donut: 46
  },
  {
    country: 'AF',
    'hot dog': 32,
    burger: 78,
    sandwich: 5,
    kebab: 139,
    fries: 64,
    donut: 118
  },
  {
    country: 'AG',
    'hot dog': 127,
    burger: 145,
    sandwich: 166,
    kebab: 102,
    fries: 177,
    donut: 123
  },
  {
    country: 'AI',
    'hot dog': 63,
    burger: 81,
    sandwich: 40,
    kebab: 114,
    fries: 40,
    donut: 54
  },
  {
    country: 'AL',
    'hot dog': 34,
    burger: 116,
    sandwich: 160,
    kebab: 9,
    fries: 180,
    donut: 21
  },
  {
    country: 'AM',
    'hot dog': 176,
    burger: 141,
    sandwich: 180,
    kebab: 200,
    fries: 117,
    donut: 178
  }
];
