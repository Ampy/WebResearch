using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using System.Web.Mvc;
using WebResearch.WebAPI;

namespace WebResearch.Controllers
{
    public class JsonController : Controller
    {
        protected string jsonContext = "application/json";

        protected override JsonResult Json(object data, string contentType, Encoding contentEncoding)
        {
            return new JsonNetResult { Data = data, ContentType = contentType, ContentEncoding = contentEncoding, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        protected override JsonResult Json(object data, string contentType, Encoding contentEncoding, JsonRequestBehavior behavior)
        {
            return new JsonNetResult { Data = data, ContentType = contentType, ContentEncoding = contentEncoding, JsonRequestBehavior = behavior };
        }

        protected virtual JsonResult DefaultJson(object data)
        {
            return new JsonNetResult { Data = data, ContentType = jsonContext, ContentEncoding = Encoding.UTF8, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        protected virtual ContentResult ErrorContent(string content)
        {
            HttpContext.Response.StatusCode = 400;

            return base.Content(content, "application/text", Encoding.UTF8);
        }
    }
}
