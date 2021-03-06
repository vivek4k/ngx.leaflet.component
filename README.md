# ngx.leaflet.component

## Native Angular Components designed to be used directly on the templates without much customization

[website with examples](https://elasticrash.github.io/Angular.io.MapViewer/app/)

Old Examples
* [base example](https://elasticrash.github.io/Angular.io.MapViewer/example/)
* [multi-map example ](https://elasticrash.github.io/Angular.io.MapViewer/example/#/mm-map)
* [star map using L.CRS.Simple ](https://elasticrash.github.io/Angular.io.MapViewer/example/#/simple)
* [custom CRS using leaflet ](https://elasticrash.github.io/Angular.io.MapViewer/example/#/prj)
* [a genetic like algorithm trying to solve the Travelling salesman problem ](https://elasticrash.github.io/Angular.io.MapViewer/example/#/random)

Examples sources can be found in the following github repository [here](https://github.com/elasticrash/Angular.io.MapViewer)


Install
```terminal
npm install ngx.leaflet.components
npm install leaflet
```

USE

```javascript
import { ngxLeafletModule } from 'ngx.leaflet.components';

@NgModule({
  imports: [ngxLeafletModule],
})
```

Leaflet stylesheets are not included automatically for the time, so you need to add it yourself

for usage and basic examples check the wiki

https://github.com/elasticrash/ngx.leaflet.component/wiki


If anyone wants to help in any way feel free to do a fork and a pull request

## NOTE

* angular 4/5 use for versions 1.4.2
* angular 6 use versions 2.0.0+

version 2.0.0 at the moment is not yet on npm due to not being tested properly but it can be easily be build by running
* npm run build
