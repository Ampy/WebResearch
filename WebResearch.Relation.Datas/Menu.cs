using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace WebResearch.Relation.Datas
{
    [DataContract]
    public class Menu : QuantumCode.Tree.MPTTA.TreeNode
    {
        [DataMember]
        private string menuCaption;

        public virtual string MenuCaption
        {
            get { return menuCaption; }
            set { menuCaption = value; }
        }

        public override object Clone()
        {
            Menu m = base.Clone() as Menu;

            m.MenuCaption = menuCaption;
            return m;
        }

        [DataMember]
        private ACUri uri;

        public virtual ACUri Uri
        {
            get { return uri; }
            set { uri = value; }
        }
    }
}
