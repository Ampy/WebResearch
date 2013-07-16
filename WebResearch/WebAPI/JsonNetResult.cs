using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebResearch.WebAPI
{
    public class JsonNetResult : JsonResult
    {
        public override void ExecuteResult(ControllerContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException("context");
            }
            HttpResponseBase response = context.HttpContext.Response;
            response.ContentType = !string.IsNullOrEmpty(base.ContentType) ? base.ContentType : "application/json";
            if (base.ContentEncoding != null)
            {
                response.ContentEncoding = base.ContentEncoding;
            }
            if (base.Data != null)
            {
                JsonConvert.DefaultSettings = () => new JsonSerializerSettings { 
                    DateFormatString = "yyyy年MM月dd日HH:mm"
                    //,ContractResolver = new NHibernateContractResolver()
                };
                string s = JsonConvert.SerializeObject(base.Data, Formatting.Indented);
                response.Write(s);
            }
        }
    }
}