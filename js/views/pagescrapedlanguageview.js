define(["jQuery","Underscore","Backbone","models/pageelement","collections/pageelements","views/pagetocbar","views/pagesearchheader","views/searchresults","views/pagesearchresults","text!templates/tocpagescraperesult.html","text!templates/page.html"],function(a,b,c,d,e,f,g,h,i,j,k){var l=c.View.extend({initialize:function(){b.bindAll(this,"render","setActive","setQuery"),this.active=!1,this.languageName=this.options.languageName,this.$searchResultsDiv=a("#search-results");var c=this.options.mainSearchResultsView?this.options.mainSearchResultsView:i;this.mainResultsView=new c({el:"#search-results",collection:this.collection,itemTemplate:k,visibleField:"mainVisible",languageName:this.languageName,spinner:!0}),this.createAndRenderViews=b.once(function(){this.pageElements=new e;var a={};for(var b=0;b<this.collection.length;++b){var c=this.collection.at(b),i=c.get("searchableItems");for(var k=0;k<i.length;++k){var l=i[k];this.pageElements.add(new d({domId:l.domId,name:l.name,page:c}),{silent:!0}),a[l.name]=c}}console.log("[Rendering "+this.languageName+".]"),this.tocBarView=new f({el:"#toc",collection:this.collection,nameToPageMap:a,languageName:this.languageName}),this.searchHeaderView=new g({el:"#search-header",pages:this.collection,pageElements:this.pageElements,nameToPageMap:a,placeholder:this.options.placeholder,languageName:this.languageName,debounceTime:this.options.debounceTime,minQueryLength:this.options.minQueryLength});var m=this.options.tocSearchResultsView?this.tocSearchResultsView:h;this.tocResultsView=new m({el:"#toc-results",collection:this.pageElements,itemTemplate:j,languageName:this.languageName,visibleField:"tocVisible"}),this.tocResultsView.render()})},render:function(){return this.searchHeaderView&&this.searchHeaderView.render(),this},setActive:function(a){console.log("[setActive: "+this.languageName+" = "+a+".]");if(a&&!this.active){this.render(),this.$searchResultsDiv.addClass(this.options.resultsClassNames);if(this.collection.length>0)this.searchHeaderView.addBindings(),this.tocBarView.addBindings(),this.searchHeaderView.onSearch(),this.active=!0;else{console.log("[Fetching "+this.languageName+".]"),this.mainResultsView.startSpinner();var b=this;this.collection.fetch({success:function(a,c){console.log("[Success fetching "+b.languageName+".]"),b.createAndRenderViews(),b.searchHeaderView.lastQuery=null,b.searchHeaderView.onSearch(),b.mainResultsView.spinner.stop(),b.lastQuery&&b.setQuery(b.lastQuery),b.active=!0}})}}else!a&&this.active&&(this.searchHeaderView.removeBindings(),this.tocBarView.removeBindings(),this.collection.each(function(a){a.set({mainVisible:!1})}),this.pageElements&&this.pageElements.each(function(a){a.set({tocVisible:!1})}),this.active=!1,this.searchHeaderView.lastQuery=null,this.$searchResultsDiv.removeClass(this.options.resultsClassNames))},setQuery:function(a){b.isUndefined(this.searchHeaderView)?this.lastQuery=a:(this.searchHeaderView.$("#search-box").val(a),this.searchHeaderView.onSearch())}});return l})