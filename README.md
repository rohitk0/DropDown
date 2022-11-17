# DropDown
##Props->

  #### multi -> true for multiselect else single select
  #### value -> will be null or object in case of single select || array in case of multi-select
  #### name  -> will be string
  #### onChange -> handler function
  #### fetchOptions -> to fetch option(can be async or sync) 
  #### popperStyle -> will be applied to the popper,
  #### showCheckBox -> true will show checkbox
  #### showSelectAll -> true will show selectAll( applicable in multi-select only),
  #### onDragEnd -> handler function (will be invoked on dragend) (applicable if isDragable is set to true),
  #### isDragable -> true for drag behaviour,
  #### isClearAble -> user can clear all selected option,
  #### isSearchAble -> true will inable smart search (default is true),
  #### labelAccessor -> a string will represent the path for label i.e. option= {name:{first_name:"abcd"}} then path will be name.first_name,
  #### size -> will be applied to input (text field and checkbox),
  #### ...rest -> rest will be applied to the textfield
  
  ### Demo ->  https://drop-down-iota.vercel.app/