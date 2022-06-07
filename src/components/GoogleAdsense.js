import { useEffect } from 'react';

const GoogleAdsense = ({
  className = 'adsbygoogle',
  client = '',
  slot = '',
  format = '',
  responsive = '',
  layoutKey = '',
}) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      if (process.env.NODE_ENV !== 'production')
        console.error('AdvertiseError', e);
    }
  }, []);
  return (
    <ins
      className={className}
      style={{
        overflowX: 'auto',
        overflowY: 'hidden',
        display: 'block',
        textAlign: 'center',
      }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive}
      data-ad-layout-key={layoutKey}
    />
  );
};

export default GoogleAdsense;

export const infeedProps = {
  format: 'fluid',
  layoutKey: '-fz+6a+19-cg+hh',
  client: 'ca-pub-8961451245722613',
  slot: '4628320897',
  responsive: 'true',
};
