<?php

namespace App\Http\Voyager\Widgets;

use TCG\Voyager\Widgets\BaseDimmer;
use Illuminate\Support\Facades\Auth;
use TCG\Voyager\Facades\Voyager;

use App\Models\Wordle;

class WordleDimmer extends BaseDimmer
{
    /**
     * The configuration array.
     *
     * @var array
     */
    protected $config = [];

    /**
     * Treat this method as a controller action.
     * Return view() or other content to display.
     */
    public function run()
    {
        $count = Wordle::count();
        $string = trans_choice('voyager::dimmer.wordle', $count);

        return view('voyager::dimmer', array_merge($this->config, [
            'icon'   => 'voyager-bubble-hear',
            'title'  => "{$count} wordles",
            'text'   => 'Gestión de los wordles',
            'button' => [
                'text' => 'Ver wordles',
                'link' => route('voyager.wordles.index'),
            ],
            'image' => voyager_asset('images/widget-backgrounds/02.jpg'),
        ]));
    }

    /**
     * Determine if the widget should be displayed.
     *
     * @return bool
     */
    public function shouldBeDisplayed()
    {
        //return Auth::user()->can('browse', Voyager::model('User'));
        return Auth::user();
    }
}
