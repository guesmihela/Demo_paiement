frappe.listview_settings['Prime_Issue'] = frappe.listview_settings['Prime_Issue'] || {
    hide_name_column : true, // HIDE THE NAME COLUMN IN THE LAST
	add_fields: ["identity_number", "branch", "identity_type", "state"],
	filters: [
	   ["state","=", "Unpaid"],
	   ["delai_garde","=", "dépassé"]
	],
	refresh: function(listview) {
       frappe.call({
		 method: "frappe.client.get_list",
		 async: false,
		 args: {
			doctype: "Prime_Issue",
			fieldname: ['name', 'state', 'end_period_date', 'delai_recours', 'delai_garde']
		 },
		 callback: function(r)
		 {
			if(r.message)
			{
			  $.each(r.message, function(i,d){
			     frappe.call({
			        method: "frappe.client.get_value",
			        async: false,
			        args: {
				       doctype: "Prime_Issue",
				       filters: {"name": d.name},
				       fieldname: ['name', 'state', 'end_period_date', 'delai_recours', 'delai_garde', 'prerecovfolder', 'state_prerecovfolder' ]
			        },
			        callback: function(r)
			        {
			           var delai_garde = frappe.datetime.add_days(r.message['end_period_date'], r.message['delai_recours']);
			           //msgprint("delai de garde de prime issue" + delai_garde);
			           //msgprint("delai de garde de prime issue" + frappe.datetime.get_today())
			           if(delai_garde < frappe.datetime.get_today())
			           {
			              msgprint("delai de garde de prime issue 111111" + r.message['name']);
			              frappe.db.set_value("Prime_Issue",r.message['name'],{
                          "delai_garde": "dépassé"});
			           }
			           if(r.message['state'] == 'Unpaid' && r.message['delai_garde'] == 'en cours')
			           {
			           /*if(delai_garde < frappe.datetime.get_today() && r.message['state'] == 'Unpaid' && r.message['delai_garde'] == 'en cours')
			           {*/
			              //msgprint("delai de garde de prime issue" + r.message['name'])
			              frappe.db.set_value("Prime_Issue",r.message['name'],{
                          "delai_garde": "dépassé"});
			           }
			            /*if(r.message['prerecovfolder'] !== '---')
                        {
                          frappe.call({
			                 method: "frappe.client.get_value",
			                 async: false,
			                 args: {
				                doctype: "PreRecoveryFolder",
				                filters: {"name": r.message['prerecovfolder']},
				                fieldname: ["state_folder"]
			                 },
			                 callback: function(d)
			                 {
			                   if(r.message["state_prerecovfolder"] !== d.message["state_folder"])
			                   {
			                     frappe.db.set_value("Prime_Issue",r.message['name'],{
                                 "state_prerecovfolder": d.message["state_folder"]});
			                   }
			                 }
			              });
	                    }*/
			        }
			     });
			  });
			}
		 }
	  });
	},
	onload: function(listview) {

      var items = [];
      var itemsP = [];
      var item = {};
      var data = [];
      $('*[data-fieldname="name"]').hide();
	  $('*[data-fieldname="contract_number"]').hide();
	  function search()
      {
          var identity_number = $('input[data-fieldname="identity_number"]').val();
	      var identity_type = $('select[data-fieldname="identity_type"]').val();
	      var branch = $('input[data-fieldname="branch"]').val();
	      var trait_stat = $('select[data-fieldname="traitment_state"]').val();
	      var list_primes_issues = [];
          if(branch == '' && !identity_type  && identity_number == '' && !trait_stat)
          {
             if(frappe.route_options)
             {
		        frappe.set_route("List", "Prime_Issue", "List");
		     }
             frappe.set_route("List", "Prime_Issue", {"state": "Unpaid", "delai_garde": "dépassé"});
          }
          else
          {
            frappe.call({
               method: 'icrm.recovery.doctype.prime_issue.prime_issue.getFilterPerson',
               args: {
                id_type: identity_type,
                id_number: identity_number,
                //branch: branch
                },
                callback: function(r)
			    {
                  if(r.message)
                  {
                     for(var i = 0; i < r.message.length; i++) {
                        var msg = r.message[i];
                        list_primes_issues.push(msg);
                     }
                     if(frappe.route_options){
		                  frappe.set_route("List", "Prime_Issue", "List");
		             }
                     if(list_primes_issues.length) {
			              //frappe.route_options = {"name": ["in", list_primes_issues], "state": "Unpaid", "traitment_state": trait_stat};
                          frappe.set_route("List", "Prime_Issue", {"name": ["in", list_primes_issues], "state": "Unpaid", "traitment_state": trait_stat, "branch": branch});
			         }
			         else {
			           frappe.msgprint(__("Sorry dont have a prime issue  associated to this informations"));
			         }
                  }
                }
            });
          }
      }
      function createPreRecovFolder()
      {
      /******** get list of selected prime Issue*****/
	     const selected_docs = listview.get_checked_items();
         const docnames = listview.get_checked_items(true);
         if(selected_docs == '')
         {
          msgprint(__(" No item selected , please select at least one"));
         }
         //console.log("selected_docs " + selected_docs);
         /*if(selected_docs !== '')
         {
          //listview.page.remove_inner_button('Paiement Prime')
         }*/
         var list_person = [];
         var tot_amount = 0;
         var tot_account = 0;
         var inprogr_preRecF = [];
         var enatten_preRecF = [];
         var pre_recov_attach = [];
         //var doc_pre_created = 0;
         var items = [];
         var items_doc_parent = [];
         for(let doc of selected_docs)
         {
           if(doc.state !== 'Unpaid')
           {
              //frappe.throw(__(" All prime issue checked must be unpaid to create preRecoveryFolder"));
              frappe.throw(__(" prime issue checked attached at preRecoveryFolder en cours de recouvrement"));
           }
           frappe.call({
               method: 'icrm.recovery.doctype.prime_issue.prime_issue.createpreRecovFolder',
               async : false,
               args: {
               },
               callback: function(r)
			   {
			   if(r.message)
               {
                  for(var i = 0; i < r.message.length; i++) {
                     if(doc.name == r.message[i].prime_issue && doc.prerecovfolder == r.message[i].parent)
                     {
                      if(doc.state_prerecovfolder !== 'En Attente'){
                         inprogr_preRecF.push(doc.name);
                      }
                      else if(doc.state_prerecovfolder == 'En Attente')
                      {
                         enatten_preRecF.push(doc.name);
                      }
                      }
                  }
               }
			   }
           });
           frappe.call({
               method: 'icrm.recovery.doctype.prime_issue.prime_issue.OnePersonforFolder',
               async: false,
               args: {
               contract_number: doc.contract_number,
               },
               callback: function(r)
			   {
			     if(r.message)
			     {
			       $.each(r.message, function(i,d){
			        list_person.push(r.message[i]);
			       });
                 }
		       }
           });
           frappe.call({
			    method: "frappe.client.get_value",
			    async: false,
			    args: {
				    doctype: "PreRecoveryFolder",
				    filters: {"branch": doc.branch, "person": doc.person, "state_folder": "En Attente" },
				    fieldname: ["name", "state_folder"]
			    },
			    callback: function(r)
			    {
			       if(r.message['name'])
			       {
                         var item = {
                              'pre_recov' : r.message['name'],
	                          'prime_issue' : doc.name,
	                          'prime_issue_number' : doc.prime_issue_number,
	                          'contract_number' : doc.contract_number,
	                          'total_amount' : doc.total_amount,
	                          'total_account': doc.account_amount,
	                          'state'          : doc.state
	                     };
	                     if(doc.prerecovfolder === '---')
	                     {
	                        items_doc_parent.push(item);
	                     }
	                     else
	                     {
	                        pre_recov_attach.push(item)
	                     }
	               }
		        }
		   });
         }
         if(items_doc_parent.length != 0)
         {
            frappe.call({
              method: 'icrm.recovery.doctype.prime_issue.prime_issue.preRec_EnAtt',
              args: {
                  items: items_doc_parent
              },
            }).then(r => {
                listview.refresh();
            });
         }
         if( items_doc_parent.length == 0 && pre_recov_attach.length != 0 )
         {
           msgprint(__("prime issue attached at PreRecovery Folder "));
         }
         /****eliminer les doublons du prime issues******/
         //inprogr_preRecF = inprogr_preRecF.filter((ele,pos)=>inprogr_preRecF.indexOf(ele) == pos)
         //enatten_preRecF = enatten_preRecF.filter((ele,pos)=>enatten_preRecF.indexOf(ele) == pos)
         if(inprogr_preRecF.length == 0 && enatten_preRecF.length == 0 && items_doc_parent.length == 0)
         {
            for(var i = 0; i < list_person.length; i++)
            {
              var test = enatten_preRecF.includes(docnames[i]);
              console.log("tesssssssssst includes" + test);
              /*if(inprogr_preRecF.includes(docnames[i]) == false && enatten_preRecF.includes(docnames[i]) == false)
              {*/
              var doc = frappe.model.get_new_doc("PreRecoveryFolder");
              //console.log("perrrrrrrrrrrrrriiii "+i + list_person[i][0]);
              //console.log("branche iii "+i + list_person[i][1]);
              doc.branch =  list_person[i][1];
              doc.person =  list_person[i][0];
              frappe.call({
			         method: "frappe.client.get_value",
			         async: false,
			         args: {
				            doctype: "Prime_Issue",
				            filters: {"name": docnames[i]},
				            fieldname: ["total_amount", "account_amount", "prime_issue_number", "contract_number", "state"]
			         },
			         callback: function(r)
			         {
                       var item = {
	                       'prime_issue' : docnames[i],
	                       'prime_issue_number' : r.message["prime_issue_number"],
	                       'contract_number' : r.message["contract_number"],
	                       'total_amount' : r.message["total_amount"],
	                       'total_account'	: r.message["account_amount"],
	                       'state'          : r.message["state"]
	                       };
	                       items.push(item);
	                       tot_amount = tot_amount + flt(r.message["total_amount"]);
	                       tot_account = tot_account + flt(r.message["account_amount"]);
		            }
			  });
              for(var j = i+1; j < list_person.length; j++)
              {
                 /*if(list_person[j] == list_person[i])
                 if(list_person[j] == 'Guesmi Hela')*/
                 if(list_person[j][0] == ''+list_person[i][0]+'' && list_person[j][1] == ''+list_person[i][1]+'')
                 {
                    //console.log("perrrrrrrrrrrrrr jjj"+j + list_person[j][0]);
                    //console.log("branche jjj"+j + list_person[j][1]);
                    frappe.call({
			          method: "frappe.client.get_value",
			          async: false,
			          args: {
				        doctype: "Prime_Issue",
				        filters: {"name": docnames[j]},
				        fieldname: ["total_amount", "account_amount", "prime_issue_number", "contract_number"]
			          },
			          callback: function(r)
			          {
                          var item_j = {
	                          'prime_issue' : docnames[j],
	                          'prime_issue_number' : r.message["prime_issue_number"],
	                          'contract_number' : r.message["contract_number"],
	                          'total_amount' : r.message["total_amount"],
	                          'total_account'	: r.message["account_amount"],
	                          'state'          : r.message["state"]
	                       };
	                       items.push(item_j);
	                       tot_amount = tot_amount + flt(r.message["total_amount"]);
	                       tot_account = tot_account + flt(r.message["account_amount"]);
		              }
			        });
			        //console.log("items" + items)
                    delete list_person[j];
                    //list_person = list_person.filter(item => item !== list_person[j])
                 }else
                 {
                   //console.log("not egale");
                 }
              }
              var tot_unpaid = tot_amount - tot_account;
		      doc.fee_lmd = '0.0';
              doc.other_fee = '0.0';
              doc.total_amount = tot_amount;
              doc.total_account = tot_account;
              doc.total_unpaid = tot_unpaid;
              doc.state_folder ="En Attente";
              doc.date_sending_lmd = '';
              date_sending_threat = '';
              doc.traitment_state = "En Attente";
              doc.prime_issue = items;
              frappe.db.insert(doc);
              items = [];
              //frappe.db.insert(doc).then(doc => {
              /*frappe.call({
                 method: 'icrm.recovery.doctype.prerecoveryfolder.prerecoveryfolder.send_email',
                 args: {
                   doc: doc.name
                 },
                 async : false,
              }).then(r => {
              console.log("success sending email");
              });*/
              //});
            }
            msgprint(__("PreRecovery Folder created successfully"));
            listview.refresh();
         }
         else if(inprogr_preRecF.length != 0){
           frappe.throw(__(" prime issue checked[ "+inprogr_preRecF+" ] attached at preRecoveryFolder en cours de recouvrement"));
         }
         else if(enatten_preRecF.length != 0){
            var itm_pr =  [];
            var itm_pr_arr = [].concat(selected_docs);
            //var itm_pr = [].concat(selected_docs);
            for(var i = 0; i < selected_docs.length; i++)
            {
                for(var j = i+1; j < selected_docs.length; j++)
                {
                     //if(list_person[i] !== undefined && list_person[j] !== undefined && list_person[j][0] == ''+list_person[i][0]+'' && list_person[j][1] == ''+list_person[i][1]+'')
                     if(selected_docs[i] !== undefined && selected_docs[j] !== undefined && selected_docs[i]['branch'] == selected_docs[j]['branch'] && selected_docs[i]['person'] == selected_docs[j]['person'])
                     {
                        if(selected_docs[i]['state_prerecovfolder'] == 'En Attente' && selected_docs[j]['state_prerecovfolder'] !== 'En Attente')
                        {
                           frappe.call({
			                   method: "frappe.client.get_value",
			                   async: false,
			                   args: {
				                   doctype: "Prime_Issue",
				                   filters: {"name": selected_docs[j]['name']},
				                   fieldname: ["total_amount", "account_amount", "prime_issue_number", "contract_number", "state", "prerecovfolder", "state_prerecovfolder"]
			                   },
			                   callback: function(r)
			                   {
                                  var item_j = {
                                    'pre_recov' : selected_docs[i]['prerecovfolder'],
	                                'prime_issue' : selected_docs[j]['name'],
	                                'prime_issue_number' : r.message["prime_issue_number"],
	                                'contract_number' : r.message["contract_number"],
	                                'total_amount' : r.message["total_amount"],
	                                'total_account'	: r.message["account_amount"],
	                                'state'          : r.message["state"]
	                              };
	                              items.push(item_j);
		                      }
			               });
                           delete selected_docs[j];
                           itm_pr = selected_docs;
                           //delete list_person[j];
			            }
			            else if(selected_docs[i]['state_prerecovfolder'] !== 'En Attente' && selected_docs[j]['state_prerecovfolder'] == 'En Attente')
                        {
                           frappe.call({
			                   method: "frappe.client.get_value",
			                   async: false,
			                   args: {
				                   doctype: "Prime_Issue",
				                   filters: {"name": selected_docs[i]['name']},
				                   fieldname: ["total_amount", "account_amount", "prime_issue_number", "contract_number", "state", "prerecovfolder", "state_prerecovfolder"]
			                   },
			                   callback: function(r)
			                   {
                                 var item = {
                                   'pre_recov' : selected_docs[j]['prerecovfolder'],
	                               'prime_issue' : selected_docs[i]['name'],
	                               'prime_issue_number' : r.message["prime_issue_number"],
	                               'contract_number' : r.message["contract_number"],
	                               'total_amount' : r.message["total_amount"],
	                               'total_account'	: r.message["account_amount"],
	                               'state'          : r.message["state"]
	                             };
	                             items.push(item);
		                       }
			               });
			               delete itm_pr_arr[i];
			               //delete selected_docs[i];
			               //delete list_person[j];
			               //selected_docs.splice(i,0);
			               //itm_pr = itm_pr.splice(i,1);
			               itm_pr = itm_pr_arr;
                        }
                        delete list_person[j];
                        //itm_pr = selected_docs;
                        //list_person = list_person.filter(item => item !== list_person[j])
                        //list_person.splice(j, 1)
                     }
                     else
                     {
                       items = [];
                     }
                }
                }
                /***/
                if(items.length != 0)
                {
                   frappe.call({
                     method: 'icrm.recovery.doctype.prime_issue.prime_issue.preRec_EnAtt',
                     args: {
                       items: items
                     },
                   }).then(r => {
                     listview.refresh();
                     console.log("prime issues  est ajouté avec succes");
                   });
                }
                /***/
                var docs_items = [];
                var docs = [];
                var items_parent = [];
                for(var i = 0; i < itm_pr.length; i++)
                {
                  var doc = frappe.model.get_new_doc("PreRecoveryFolder");
                  if(itm_pr[i] !== undefined && itm_pr[i]['state_prerecovfolder'] !== 'En Attente')
                  {
                     frappe.call({
			                   method: "frappe.client.get_value",
			                   async: false,
			                   args: {
				                   doctype: "PreRecoveryFolder",
				                   filters: {"branch": itm_pr[i]['branch'], "person": itm_pr[i]['person']},
				                   fieldname: ["name", "state_folder"]
			                   },
			                   callback: function(r)
			                   {
			                     if(r.message['name'])
			                     {
                                   var item = {
                                     'pre_recov' : r.message['name'],
	                                 'prime_issue' : itm_pr[i]['name'],
	                                 'prime_issue_number' : itm_pr[i]["prime_issue_number"],
	                                 'contract_number' : itm_pr[i]["contract_number"],
	                                 'total_amount' : itm_pr[i]["total_amount"],
	                                 'total_account'	: itm_pr[i]["account_amount"],
	                                 'state'          : itm_pr[i]["state"]
	                               };
	                               items_parent.push(item);
	                             }
		                       }
		             });
                    if(items_parent.length == 0)
                    {
                      doc.branch =  itm_pr[i]['branch'];
                      doc.person =  itm_pr[i]['person'];
                      frappe.call({
			            method: "frappe.client.get_value",
			            async: false,
			            args: {
				          doctype: "Prime_Issue",
				          filters: {"name": itm_pr[i]['name']},
				          fieldname: ["total_amount", "account_amount", "prime_issue_number", "contract_number", "state"]
			            },
			            callback: function(r)
			            {
                          var item = {
	                        'prime_issue' : itm_pr[i]['name'],
	                        'prime_issue_number' : r.message["prime_issue_number"],
	                        'contract_number' : r.message["contract_number"],
	                        'total_amount' : r.message["total_amount"],
	                        'total_account'	: r.message["account_amount"],
	                        'state'          : r.message["state"]
	                      };
	                      docs_items.push(item);
	                      tot_amount = tot_amount + flt(r.message["total_amount"]);
	                      tot_account = tot_account + flt(r.message["account_amount"]);
		                }
			          });
			          docs.push(itm_pr[i]['name']);
			          for(var j = i+1; j < itm_pr.length; j++)
                      {
                        if(itm_pr[i]['branch'] == ''+itm_pr[j]['branch']+'' && itm_pr[i]['person'] == ''+itm_pr[j]['person']+'')
                         {
                           if(itm_pr[j] !== undefined && itm_pr[j]['state_prerecovfolder'] !== 'En Attente')
                           {
			                 frappe.call({
			                    method: "frappe.client.get_value",
			                    async: false,
			                    args: {
				                  doctype: "Prime_Issue",
				                  filters: {"name": itm_pr[j]['name']},
				                  fieldname: ["total_amount", "account_amount", "prime_issue_number", "contract_number"]
			                    },
			                    callback: function(r)
			                    {
                                  var item_j = {
	                               'prime_issue' : itm_pr[j]['name'],
	                               'prime_issue_number' : r.message["prime_issue_number"],
	                               'contract_number' : r.message["contract_number"],
	                               'total_amount' : r.message["total_amount"],
	                               'total_account'	: r.message["account_amount"],
	                               'state'          : r.message["state"]
	                              };
	                              docs_items.push(item_j);
	                              tot_amount = tot_amount + flt(r.message["total_amount"]);
	                              tot_account = tot_account + flt(r.message["account_amount"]);
		                        }
			                 });
			                 docs.push(itm_pr[j]['name']);
			               }
			             }
			             delete itm_pr[j];
			          }
			          var tot_unpaid = tot_amount - tot_account;
		              doc.fee_lmd = '0.0';
                      doc.other_fee = '0.0';
                      doc.total_amount = tot_amount;
                      doc.total_account = tot_account;
                      doc.total_unpaid = tot_unpaid;
                      doc.state_folder ="En Attente";
                      doc.date_sending_lmd = '';
                      date_sending_threat = '';
                      doc.traitment_state = "En Attente";
                      doc.prime_issue = docs_items;
                      var docs_arr = docs;
                      frappe.db.insert(doc).then(doc => {
                        for(var i = 0; i < docs_arr.length; i++)
                        {
                          frappe.db.set_value("Prime_Issue", docs_arr[i],{
                              "state_prerecovfolder": doc.state_folder,
                              "prerecovfolder": doc.name,
                              "traitment_state": "In Progress"
                          });
                          listview.refresh();
                        }
                        frappe.call({
                          method: 'icrm.recovery.doctype.prerecoveryfolder.prerecoveryfolder.send_email',
                          args: {
                            doc: doc.name
                          },
                          async : false,
                        }).then(r => {
                          console.log("success sending email");
                        });
                      });
                      listview.refresh();
                    }
                  }
                }
                if(items_parent.length != 0)
                {
                  frappe.call({
                     method: 'icrm.recovery.doctype.prime_issue.prime_issue.preRec_EnAtt',
                     args: {
                        items: items_parent
                     },
                  }).then(r => {
                         listview.refresh();
                  });
                }
         }
         items_parent = [];
         items = [];
         inprogr_preRecF = [];
         enatten_preRecF = [];
         list_person = [];
         listview.refresh();
      }
      function paiement()
      {
         const selected_docs = listview.get_checked_items();
         const docnames = listview.get_checked_items(true);
         if(selected_docs == '')
         {
          msgprint(__(" No item selected , please select at least one"));
         }
         else
         {
           var prerecF = '';
           for(let doc of selected_docs)
           {
            if(doc.state_prerecovfolder !== 'En Attente')
            {
              frappe.throw(__("All prime issue checked must have En Attente preRecoveryFolder State"));
            }
            else
            {
             prerecF = doc.prerecovfolder;
            }
            }
             var doc = frappe.model.get_new_doc("PaiementPrime");
             for(var i = 0; i < docnames.length; i++)
             {
             frappe.call({
			        method: "frappe.client.get_value",
			        async: false,
			        args: {
				        doctype: "Prime_Issue",
				        filters: {"name": docnames[i]},
				        fieldname: ["total_amount", "account_amount", "prime_issue_number", "contract_number","state"]
			            },
			            callback: function(r)
			            {
                          var item_P= {
	                          'prime_issue' : docnames[i],
	                          'prime_issue_number' : r.message["prime_issue_number"],
	                          'contract_number' : r.message["contract_number"],
	                          'total_amount' : r.message["total_amount"],
	                          'total_account'	: r.message["account_amount"],
	                          'state'          : r.message["state"]
	                       };
	                       itemsP.push(item_P);
		                }
			     });
			     doc.prerecov_folder = prerecF;
			     }
			     doc.paiement_mode = '';
			     doc.decision = '';
			     doc.prime_issue = itemsP;
			     doc.fee_lmd = '';
			     doc.shedule_type = '';
			     doc.start_dateshedule = '';
			     doc.rateshedule = '';
			     doc.shedule_lenght = '';
			     doc.total_amountdue = '0.0';
			     //frappe.db.insert(doc);
			     itemsP = [];
			     frappe.set_route("Form", "PaiementPrime", doc.name);
	    }
      }
      function paiementCreance()
      {
          var identity_number = $('input[data-fieldname="identity_number"]').val();
	      var identity_type = $('select[data-fieldname="identity_type"]').val();
	      var branch = $('input[data-fieldname="branch"]').val();
	      var list_contracts = [];
           if(branch == '' && identity_type == '' && identity_number == '')
           {
             frappe.set_route("List", "Prime_Issue", {"state": "Unpaid", "state_prerecovfolder" : "En Attente"});
           }
           else
           {
            frappe.call({
               method: 'icrm.recovery.doctype.prime_issue.prime_issue.getFilterPerson',
               args: {
                id_type: identity_type,
                id_number: identity_number,
                branch: branch
               },
            }).then(r => {
               if(r.message)
                {
                  for(var i = 0; i < r.message.length; i++) {
                      var msg = r.message[i];
                      list_contracts.push(msg);
                  }
                  frappe.set_route("List", "Prime_Issue", {"contracts": ["in", list_contracts],"state": "Unpaid", "state_prerecovfolder" : "En Attente"});
                }
              });
            }
      }
      function reset()
      {
      	  $('input[data-fieldname="identity_number"]').val(' ');
	      $('select[data-fieldname="identity_type"]').val('');
	      $('input[data-fieldname="branch"]').val('');
	      frappe.set_route("List", "Prime_Issue", {"state": "Unpaid"});

	  }

	  listview.page.add_menu_item(__("Paiement Créance"), function(){
          var identity_number = $('input[data-fieldname="identity_number"]').val();
	      var identity_type = $('select[data-fieldname="identity_type"]').val();
	      var branch = $('input[data-fieldname="branch"]').val();
	      var list_contracts = [];
           if(branch == '' && identity_type == '' && identity_number == '')
           {
             frappe.set_route("List", "Prime_Issue", {"state": "Unpaid", "state_prerecovfolder" : "En Attente"});
           }
           else
           {
            frappe.call({
               method: 'icrm.recovery.doctype.prime_issue.prime_issue.getFilterPerson',
               args: {
                id_type: identity_type,
                id_number: identity_number,
                branch: branch
               },
            }).then(r => {
               if(r.message)
                {
                  for(var i = 0; i < r.message.length; i++) {
                      var msg = r.message[i];
                      list_contracts.push(msg);
                  }
                  frappe.set_route("List", "Prime_Issue", {"contracts": ["in", list_contracts],"state": "Unpaid", "state_prerecovfolder" : "En Attente"});
                }
              });
            }
	  });
      $('*[data-fieldname="identity_number"]').keypress(function(e){
      if(e.which === 13){
         search();
      }});
      $('*[data-fieldname="identity_number"]').on("focusout",function(e){
      if($('input[data-fieldname="identity_number"]').val() != '' && $('select[data-fieldname="identity_type"]').val() != ''){
          search();
      }});
      $('*[data-fieldname="identity_type"]').on("focusout",function(e){
      if($('input[data-fieldname="identity_number"]').val() != '' && $('select[data-fieldname="identity_type"]').val() != ''){
          search();
      }});
      const selected_docs = listview.get_checked_items();
      //console.log("selected_docs " + selected_docs);

      /*if(selected_docs == '')
      {
          listview.page.remove_inner_button('Paiement Prime');
          listview.page.remove_inner_button('Create PreRecovery Folder');
      }
      else
      {
        listview.page.add_inner_button('Create PreRecovery Folder',()=> createPreRecovFolder()).addClass("btn-primary");
	    listview.page.add_inner_button('Paiement Prime',()=> paiement()).addClass("btn-danger");
      }*/
      listview.page.add_inner_button('Paiement/ Reglement',()=> createPreRecovFolder()).addClass("btn-primary");
	  listview.page.add_menu_item(__("Retour"), function(){
	    frappe.get_prev_route();
	  });
	},
    get_indicator: function(doc) {
        if(doc.state === "Unpaid")
        {
          return [__("Unpaid"), "red", "state,=,Unpaid"];
        }
		else if(doc.state === "Paid")
        {
           return [__("Paid"), "green", "state,=,Paid"];
        }

	},
	formatters: {
	   identity_number(val, col, row){
	      return val ? "111111" : "22222";
	   },
	   total_amount(val,col,row){
	      return val ? val.bold() : "N/A";
	   }
	}
};
frappe.listview_settings['Prime_Issue'].formatters = {

	  person(val,col,row){
	      return val ? val.bold() : "N/A";
	  },
      identity_number(val,col,row){
	      return val ? "111111" : "22222";
	  },
	  state(val,col,row){
	      return val ? val.bold() : "N/A";
	  }
};


/*var indicator = [__(doc.state), frappe.utils.guess_colour(doc.state), "state,=," + doc.state];
		indicator[1] = {"paid": "green", "unpaid": "red"}[doc.state];
        return indicator;*/



	/***************************************************/





	  //listview.page.add_button(__("search"), "default", function(){console.lo("test")});
	  /*listview.page.add_menu_item(__("Valider Recherche"), function(){
	     frappe.route_options = {
	        "state": "unpaid"
	     };
	    /*frappe.set_route("List", "Prime_Issue", "List");*/
	    /*frappe.set_route("List", "Prime_Issue", {"state": "unpaid"});*/
	  /*});
	  listview.page.add_menu_item(__("Vider Criteres Recherche"), function(){});
	  listview.page.add_menu_item(__("Retour"), function(){});
	  /*listview.page.add_action_item(__("Create PreRecovery Folder"), function(){});*/
	  /*listview.trigger("make sur your branch");
	  listview.set_primary_action(__("make search"), () => {
	      let btn_primary = listview.page.btn_primary.get(0);
	  });
	  //listview.page.add_menu(__("setas close"), function(){});
	  //listview.page.add_custom_button(__("Rechercher"), function(){});
      /*var options = [];
      var identityType = [];
      frappe.call({
	           method:'getBranch',
               doc: doc,
               //method: 'erpnext.pre_recovery_folder.doctype.prime_issue.prime_issue.validate_for_items',
               //args: {
               //},
            }).then(r => {
               /*if(r.message)
                {
                }*/
                //doc.refresh();
             /*  });
      frappe.call({
               method: 'erpnext.pre_recovery_folder.doctype.prime_issue.prime_issue.getBranchh',
               args: {
                  doctype: 'Category'
               },
            }).then(r => {
               if(r.message) {
                   for(var i = 0; i < r.message.length; i++) {
                      var msg = r.message[i].name ;
                      options.push(msg);
                      console.log("value returned is " + msg);
                     }
                   }
                console.log("value optionnnns Branch returned is " + options);
                frappe.meta.get_docfield("Prime_Issue", "branch", frm.doc.name).options = [""].concat(options);
                //frappe.model.set_value(cdt, cdn,"list_doctype", options);
                //doc.refresh_field("branch");
                listview.refresh();
            });
            frappe.call({
               method: 'erpnext.pre_recovery_folder.doctype.prime_issue.prime_issue.getIdentity',
               args: {
                  doctype: 'Identity Type'
               },
            }).then(r => {
               if(r.message) {
                   for(var i = 0; i < r.message.length; i++) {
                      var msg = r.message[i].name ;
                      identityType.push(msg);
                      console.log("value returned is " + msg);
                     }
                   }
                console.log("value optionnnns Identity returned is " + identityType);
                frappe.meta.get_docfield("Prime_Issue", "branch").options = [""].concat(identityType);
                //frappe.model.set_value(cdt, cdn,"list_doctype", options);
                //cur_frm.refresh_field("list_doctype");
            });*/

	//},
	/*add_button(name, type, wrapper_class = ".page-actions")
	{
	    const button = document.createElement("button");
	    button.classList.add("btn", "btn-" + type, "btn-sm", "ml-2");
	    button.innerHTML = name;
	    button.onclick = action;
	    document.querySelector(wrapper_class).prepend(button);
	},*/
	/*get_indicator: function(doc) {
		var indicator = [__(doc.state), frappe.utils.guess_colour(doc.state), "state,=," + doc.state];
		indicator[1] = {"paid": "green", "unpaid": "red"}[doc.state];
		return indicator;

	},*/


	/*get_indicator: function(doc) {
		var indicator = [__(doc.state), frappe.utils.guess_colour(doc.state), "state,=," + doc.state];
		var indicator[1] = {"paid": "green", "unpaid": "red"}[doc.state];
        return indicator;
	}
	/*button: {
	    search()
	    {
	    }
	}*/


                      /*for(var i = 0; i < itm_pr.length; i++)
                      {
                        if(itm_pr[i] !== undefined && itm_pr[i]['state_prerecovfolder'] !== 'En Attente')
                        {
                           console.log("created folder state itm_pr[i]['name']2222" +itm_pr[i]['name']);
                           frappe.db.set_value("Prime_Issue", "PrimeIssue-2021-00185",{
                              "state_prerecovfolder": "In Progress",
                              "prerecovfolder": "In Progress",
                              "traitment_state": "In Progress"
                           });*/

                    //var it_prim = itm_pr[i]['name'];