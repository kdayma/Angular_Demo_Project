import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import { Subscription, map, tap } from 'rxjs';
import { addRecipe, updateRecipe } from '../store/recipes.actions';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy{
  id:number;
  editMode:boolean =  false;
  recipeEditForm:FormGroup;
  storeSubscription:Subscription;

  constructor(private route:ActivatedRoute,
    private router:Router,
    private store:Store<fromApp.AppState>){}
  ngOnInit(): void {
    // this.id = this.route.snapshot.params['id'];
     this.route.params.subscribe(
      (params:Params) =>{
        this.id = +params['id'];
        this.editMode = params['id'] !=null;
        this.initForm();
      }
    )
  }
  private initForm(){
    let recipeName='';
    let recipeImagePath='';
    let recipeDescription='';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      this.storeSubscription = this.store.select('recipes').pipe(
        map((recipeState)=>{
          return recipeState.recipes.find((recipe,index)=>{
            return index === this.id;
          })
        })
      ).
      subscribe(
        (selectedRecipe)=>{
          recipeName = selectedRecipe.name;
          recipeImagePath = selectedRecipe.imagePath;
          recipeDescription = selectedRecipe.description;
          if (selectedRecipe['ingredients']){
            for(let ingredient of selectedRecipe.ingredients){
              recipeIngredients.push(new FormGroup({
                'name': new FormControl(ingredient.name,Validators.required),
                'amount': new FormControl(ingredient.amount,[
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
                ])
              }))
            }
          }
        }
      )
    }
    this.recipeEditForm = new FormGroup({
      'name': new FormControl(recipeName,Validators.required),
      'imagePath': new FormControl(recipeImagePath,Validators.required),
      'description': new FormControl(recipeDescription,Validators.required),
      'ingredients': recipeIngredients
    })
  }
  onSubmit(){
    const newRecipe = new Recipe(
      this.recipeEditForm.value['name'],
      this.recipeEditForm.value['description'],
      this.recipeEditForm.value['imagePath'],
      this.recipeEditForm.value['ingredients']
      );
    if(this.editMode){
      // this.recipeService.updateRecipe(this.id,newRecipe)
      this.store.dispatch(updateRecipe({payload:{id:this.id,updatedRecipe:newRecipe}}));
    }
    else {
      // this.recipeService.addRecipe(newRecipe);
      this.store.dispatch(addRecipe({payload:newRecipe}));
    }
    this.onCancelEditing();
  }

  onDeleteIngredient(id:number){
    (<FormArray>this.recipeEditForm.get('ingredients')).removeAt(id);
  }

  onCancelEditing(){
    this.router.navigate(['../'],{relativeTo:this.route});
  }

  get controls() { // a getter!
    return (<FormArray>this.recipeEditForm.get('ingredients')).controls;
  }
  onAddIngredients(){
    (<FormArray>this.recipeEditForm.get('ingredients')).push(new FormGroup({
      'name' : new FormControl(null,Validators.required),
      'amount' : new FormControl(null,[
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
      ])
    }))
  }

  ngOnDestroy(): void {
    if(this.storeSubscription){
      this.storeSubscription.unsubscribe();
    }
  }
}
