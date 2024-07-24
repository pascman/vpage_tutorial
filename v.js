function VPaging(_ct){
    const self = this;
    this._ct = _ct;
    this.sloc = location.pathname
    this.$events = []
    $(document).on('click','[page-href]',(event)=> {
        event.preventDefault();
        let href = $(event.currentTarget).attr('page-href')
        if(location.pathname == href) return false
        self.paging.apply(self,[href,true])
        return false
    })
    window.onpopstate = (event)=> {
        console.log(event)
        console.log(event.state?.href)
        if(event.state?.href) {
            self.paging.apply(self,[event.state.href,false])
        }else{
            self.paging.apply(self,[self.sloc,false])
        }
    }
}

VPaging.prototype.paging = function(href, forward = true){
    const self = this;
    const url = new URL(href,location)
    return $.get(url.pathname).then( res=> {
        let parser = new DOMParser();
        let doc = parser.parseFromString(res, 'text/html');
        let content = $(doc).find(self._ct)
        if(content.length) {
            $(self._ct).html(content.html())
            $(self._ct).attr('class',content.attr('class'))
            if(forward) {
                history.pushState({ href : url.pathname }, null, url.pathname)
            }
            self.triggerEvent('change',url.pathname)
        }
    })
}

VPaging.prototype.triggerEvent = function(_name, object){
    const self = this
    this.$events.forEach(it=> {
        if(it.name == _name) {
            it.callback?.apply(self,[self,object])
        }
    })
}


VPaging.prototype.addEventListener = function(name,callback){
   this.$events.push({ name : name , callback })
}