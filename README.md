![Bower version](https://img.shields.io/bower/v/jquery-ajax-alerts.svg)
![Nuget version](https://img.shields.io/nuget/v/geocrest.web.ajaxalerts.svg)

jquery-ajax-alerts
================

Provides some functionality for displaying Bootstrap alert messages when working with jQuery Ajax methods and, in particular, ASP.NET MVC Ajax forms. Contains a single CSS stylesheet and a simple JavaScript file. When using with an ASP.NET MVC project you can add these files to your page using a bundle or by simply adding them to the page.

[Demo](http://samples.jeffgalang.net/feedback)

##Usage
**Markup** - when using the [BeginForm](http://msdn.microsoft.com/en-us/library/system.web.mvc.ajax.ajaxextensions.beginform\(v=vs.118\).aspx) extension method you can specify the utility methods in the form's parameters like below. In the _POST_ method below the following items are optional:

-  `#mylist` refers to an element that will render new content (in this case a partial view containing a table listing all items including the newly _POST_ed  item. 
-  `#mymodal` refers to the id of a Bootstrap modal to hide after the form is submitted (in the case where the form is displayed within a modal).
-  `#btnSave` refers to the button used to submit the form. The button will switch to and from it's loading state before and after the form is submitted.

_POST_

    @using (Ajax.BeginForm("create", "somecontroller", new { area = "admin" }, new AjaxOptions 
    {
        HttpMethod = "Post",
        OnSuccess = "AjaxAlerts.onSuccess(data, '#mylist', '#mymodal', '#btnSave')",
        OnFailure = "AjaxAlerts.onFailure(xhr, status, error, '#btnSave')",
        OnBegin = "AjaxAlerts.onBegin(xhr, '#btnSave')",
        OnComplete = "AjaxAlerts.onComplete"
    }, new { @class = "form-horizontal" }))
    {
        // your form content here
    }

_DELETE_

    @using (Ajax.BeginForm("delete", "somecontroller", new { area = "admin" }, new AjaxOptions
    {
    	HttpMethod = "Delete",
        Confirm = "Delete this record? Are you sure?",
        OnSuccess = string.Format("AjaxAlerts.onDelete(data, '#row-{0}')", item.Code),
        OnFailure = "AjaxAlerts.onFailure(xhr, status, error, '')",
        OnBegin = "AjaxAlerts.onBegin(xhr, '')",
        OnComplete = "AjaxAlerts.onComplete"
    }, new { style = "display:inline;" }))
    {
    	// your form content here
	}

_PUT_

	@using (Ajax.BeginForm("edit", "somecontroller", new { area = "admin" }, new AjaxOptions
    {
    	HttpMethod = "Put",
        OnSuccess = "AjaxAlerts.onSuccess(data, '', '', '#btnSave')",
        OnFailure = "AjaxAlerts.onFailure(xhr, status, error, '#btnSave')",
        OnBegin = "AjaxAlerts.onBegin(xhr, '#btnSave')",
        OnComplete = "AjaxAlerts.onComplete"
    }, new { @class = "form-horizontal" }))
    {
    	// your form content here
	}

**Server-side** - Each action method associated with a form should return a JSON object containing the following properties:

_POST_, _PUT_

    {
      "success": <boolean>, // whether operation was successful
      "message": <string>, // success/failure message
      "content": <string> // HTML markup to render in the page
    }

_DELETE_

    {
      "success": <boolean>, // whether operation was successful
      "message": <string>, // success/failure message
      "id": <int><string><guid> // the Id of the item that was deleted 
    }

_Examples_: the following is just a sample; the important thing to notice is the use of the [Json](http://msdn.microsoft.com/en-us/library/dd504936\(v=vs.118\).aspx) method to return a [JsonResult](http://msdn.microsoft.com/en-us/library/system.web.mvc.jsonresult\(v=vs.118\).aspx).

    [HttpPut]
    [ValidateAntiForgeryToken]
    public virtual ActionResult Edit(T model)
    {
    	if (ModelState.IsValid)
        {
        	try
            {
            	this.Repository.Update<T>(model);
                this.Repository.Save();
			    return Json(new
			    {
			    	success = true,
			        message = string.Format(geocrest.web.resources.FormMessages.PutSuccess, "model"),
			        content = this.RenderPartialViewToString("list", this.Repository.All<T>().ToList())
			    });
            }
            catch (System.Exception ex)
            {
            	return Json(new
                {
                	success = false,
                    message = string.Format(geocrest.web.resources.FormMessages.PutFailure, "model", ex.Message)
                });
            }
        }
        return Json(new
        {
        	success = false,
            message = string.Join("; ", ModelState.Values.SelectMany(x => x.Errors.Select(e => e.Exception.Message)))
        });
	}

In case you're interested in the `RenderPartialViewToString` method:

    /// <summary>
    /// Renders the partial view as a string.
    /// </summary>
    /// <param name="viewName">Name of the view.</param>
    /// <param name="model">The model.</param>
    /// <returns>A string containing the rendered HTML.</returns>
    public string RenderPartialViewToString(string viewName, object model)
    {
    	this.ViewData.Model = model;
        try
        {
        	using (StringWriter sw = new StringWriter())
            {
            	ViewEngineResult viewResult = ViewEngines.Engines.FindPartialView(this.ControllerContext, viewName);
                ViewContext viewContext = new ViewContext(this.ControllerContext, viewResult.View, this.ViewData, this.TempData, sw);
                viewResult.View.Render(viewContext, sw);

                return sw.GetStringBuilder().ToString();
            }
        }
        catch (System.Exception ex)
        {
        	return ex.ToString();
        }
    }
