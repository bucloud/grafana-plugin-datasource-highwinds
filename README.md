# Highwinds-Striketracker3 Data Source Plugin for Grafana

This plugin is for Highwinds/Buwebcloud customers who use Highwinds CDN service, you can add custom databoards on your Grafana.
Metrics includes statusCode, bandwidth, cachedObject are supported. you can add hit ration easily from Grafana v7.0+

# Support
- metrics include transfer/bandwidth, statusCode, cachedObjects are supported
- variable mode is supported

# Under working
- Hosts manage
- Certificates manage

## Getting started
1. locate to grafana plugin location
```BASH
cd /var/lib/grafana/data/plugin  #default plugin location
```

2. Clone this repo
```BASH
git clone https://github.com/bucloud/grafana-plugin-datasource-highwinds
```

3. Install dependencies
```BASH
yarn install
```
4. Build plugin in development mode or run in watch mode
```BASH
yarn dev
```
or
```BASH
yarn watch
```
5. Build plugin in production mode
```BASH
yarn build
```

## Learn more about how to use grafana plugin
- [Build a data source plugin tutorial](https://grafana.com/tutorials/build-a-data-source-plugin)
- [Grafana documentation](https://grafana.com/docs/)
- [Grafana Tutorials](https://grafana.com/tutorials/) - Grafana Tutorials are step-by-step guides that help you make the most of Grafana
- [Grafana UI Library](https://developers.grafana.com/ui) - UI components to help you build interfaces using Grafana Design System
