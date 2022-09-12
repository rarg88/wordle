@extends('layouts.app')

@section('content')

<div class="game-container">
  <div class="title-container">
    <h1 class="margin-0"><!-- Button trigger modal -->
      <span type="button" data-bs-toggle="modal" data-bs-target="#instrucciones">
        ?
      </span> Wordle <img src="/image/evidenze.svg" alt="Evidenze" class="mw-100px"></h1>
  </div>
  <div class="message-container">

  </div>
  <div class="tile-container">

  </div>
  <div class="key-container">
    
  </div>
</div>



<!-- Modal -->
<div class="modal fade" id="instrucciones" tabindex="-1" aria-labelledby="instruccionesLabel" aria-hidden="true">
  <div class="modal-dialog modal-fullscreen">
    <div class="modal-content bg-modal">
      <div class="modal-body">
        <div class="row py-3">
          <div class="col-11">
            <h5 class="modal-title text-center" id="instruccionesLabel">Cómo jugar</h5>
          </div>
          <div class="col-1">
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-6 mx-auto">
            <p>Adivina la palabra oculta en seis intentos.</p>

            <p>Cada intento debe ser una palabra válida de 5 letras.</p>

            <p>Pulse enviar después de escribir la palabra elegida.</p>
              
            <p>Después de cada intento el color de las letras cambia para mostrar qué tan cerca estás de acertar la palabra.</p>
            <p class="fw-bold">Ejemplos</p>
            <div class="row">
              <div class="tile-container flex-row">
                <div class="tile flip green-overlay">N</div>
                <div class="tile flip">O</div>
                <div class="tile flip">R</div>
                <div class="tile flip">T</div>
                <div class="tile flip">E</div>
              </div>
            </div>
            <p>La letra <span class="fw-bold">N</span> está en la palabra y en la posición correcta.</p>
            <div class="row">
              <div class="tile-container flex-row">
                <div class="tile flip">C</div>
                <div class="tile flip">I</div>
                <div class="tile flip">E</div>
                <div class="tile flip yellow-overlay">L</div>
                <div class="tile flip">O</div>
              </div>
            </div>
            <p>La letra <span class="fw-bold">L</span> está en la palabra pero en la posición incorrecta.</p>
            <div class="row">
              <div class="tile-container flex-row">
                <div class="tile flip grey-overlay">P</div>
                <div class="tile flip">E</div>
                <div class="tile flip">R</div>
                <div class="tile flip">R</div>
                <div class="tile flip">O</div>
              </div>
            </div>
            <p>La letra <span class="fw-bold">P</span> no está en la palabra.</p>
            <p>Puede haber letras repetidas y en ese caso las pistas son independientes para cada letra y tienen prioridad.</p>
            <div class="row">
              <div class="col ms-auto">
                <button type="button" class="btn btn-lg btn-success" data-bs-dismiss="modal">¡Jugar!</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
@endsection