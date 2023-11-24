import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipes.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit{
  id:number;
  editMode:boolean =  false;
  recipeEditForm:FormGroup;

  constructor(private route:ActivatedRoute, private recipeService:RecipeService, private router:Router){}
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
      const selectedRecipe =  this.recipeService.getRecipeFromId(this.id);
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
      this.recipeService.updateRecipe(this.id,newRecipe)
    }
    else {
      this.recipeService.addRecipe(newRecipe);
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
}
