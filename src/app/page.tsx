import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Projet prêt !</h1>
          <p>Vous pouvez maintenant ajouter des composants et commencer à construire.</p>
          <p>Nous avons déjà ajouté le composant bouton pour vous.</p>
          <Button className="mt-2">Bouton</Button>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Appuyez sur <kbd>d</kbd> pour basculer le mode sombre)
        </div>
      </div>
    </div>
  )
}
